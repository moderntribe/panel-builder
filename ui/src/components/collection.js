import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import Sortable from 'react-sortablejs';
import classNames from 'classnames';

import { updatePanelData, movePanel, addNewPanel, addNewPanelSet, deletePanelAtIndex } from '../actions/panels';
import { MODULAR_CONTENT, BLUEPRINT_TYPES, TEMPLATES, PANELS, URL_CONFIG } from '../globals/config';
import { UI_I18N } from '../globals/i18n';

import Panel from './panel';
import Header from './collection-header';
import EditBar from './collection-edit-bar';
import CollectionPreview from './collection-preview';
import Dialog from './panel-dialog';
import Picker from './panel-picker';
import PanelSetsPicker from './panel-sets-picker';
import styles from './collection.pcss';

import * as ajax from '../util/ajax';
import * as heartbeat from '../util/data/heartbeat';
import * as tools from '../util/dom/tools';
import * as events from '../util/events';
import * as storage from '../util/storage/local';
import * as animateWindow from '../util/dom/animate-collection';
import * as defaultData from '../util/data/default-data';
import cloneDeep from '../util/data/clone-deep';

import randomString from '../util/data/random-string';

class PanelCollection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			injectionIndex: -1,
			initialData: cloneDeep(PANELS),
			keyPrefix: randomString(10),
			liveEdit: this.isActiveOnInit(),
			panelSetPickerActive: false,
			panelSetPickerEditLink: '',
			panelSetSaveError: false,
			pickerActive: false,
			refreshRate: this.getRefreshDelay(),
			triggerLiveEdit: false,
		};

		this.dataInput = document.getElementById('modular-content-data');
	}

	componentWillMount() {
		if (!this.shouldActivatePanelSets()) {
			return;
		}

		this.setState({
			panelSetPickerActive: true,
		});
	}

	componentDidMount() {
		this.bindEvents();
	}

	componentWillUnmount() {
		this.unBindEvents();
		heartbeat.destroy();
	}

	/**
	 * The live preview refresh delay can now be delayed between 1-20 seconds by the user in the live preview bar.
	 * The value is stored in localstorage.
	 */

	getRefreshDelay() {
		const savedRate = storage.get('modular-content-refresh-delay');
		return savedRate ? parseInt(savedRate, 10) : 1000;
	}

	/**
	 * Activate either if app is initially loading and url key found, or allow prop control
	 *
	 * @returns {boolean|*}
	 */
	isActiveOnInit() {
		return window.location.search.indexOf(`${URL_CONFIG.tool_arg}=${URL_CONFIG.tool_arg_id}`) !== -1;
	}

	/**
	 * Setups the autosave and heartbeat state on mount.
	 */

	bindEvents() {
		MODULAR_CONTENT.autosave = JSON.stringify({ panels: cloneDeep(this.props.panels) });
		MODULAR_CONTENT.needs_save = false;
		this.runDataHeartbeat();
		heartbeat.init({
			success: this.handleAutosaveSuccess,
		});
	}

	/**
	 * Uses a complex set of animations powered by a util to animate the editing window from its post metabox state
	 * to a full screen override of the wp admin.
	 *
	 * @param state The collection state object
	 */

	animateToLiveEdit(state = {}) {
		events.trigger({ event: 'modern_tribe/deactivate_panels', native: false });
		animateWindow.setUp(this.collection, this.sidebar);
		this.collection.setAttribute('data-iframe-loading', 'true');
		_.delay(() => {
			animateWindow.animate(this.collection, this.sidebar);
			this.setState(state, () => {
				_.delay(() => animateWindow.reset(this.collection, this.sidebar), 450);
			});
		}, 50);
	}

	/**
	 * Check if we have unsaved data
	 *
	 * @returns {boolean}
	 */

	@autobind
	isDirty() {
		return JSON.stringify(this.state.initialData) !== JSON.stringify(this.props.panels);
	}

	/**
	 * Cleans up the heartbeat interval
	 */

	unBindEvents() {
		clearInterval(this.heartbeat);
	}

	/**
	 * Can be used as callback for a manual autosave to trigger liveedit.
	 */

	@autobind
	handleAutosaveSuccess() {
		if (this.state.triggerLiveEdit) {
			this.animateToLiveEdit({
				liveEdit: true,
				triggerLiveEdit: false,
			});
		}
	}

	/**
	 * Swaps between live edit mode or not.
	 */

	@autobind
	swapEditMode() {
		if (this.state.liveEdit) {
			events.trigger({ event: 'modern_tribe/deactivate_panels', native: false });
			_.delay(() => {
				this.setState({
					liveEdit: false,
					injectionIndex: -1,
				});
			}, 150);
		} else if (MODULAR_CONTENT.needs_save) {
			this.setState({ triggerLiveEdit: true });
			heartbeat.triggerAutosave();
		} else {
			this.animateToLiveEdit({
				liveEdit: true,
			});
		}
	}

	/**
	 * Modifies a data attribute on the collection which css uses to animate the live preview iframe to a width that corresponds to the mode.
	 *
	 * @param mode {String} The modes are "mobile", "tablet", "full"
	 */

	@autobind
	swapResizeMode(mode) {
		this.collection.setAttribute('data-mode', mode);
	}

	/**
	 * Toggles whether a panel is active bool on this class.
	 *
	 * @param active {Boolean} Active?
	 */

	@autobind
	panelsActivate(active) {
		// reset the sidebar to top when animating in children
		if (active) {
			this.sidebar.scrollTop = 0;
		}
		this.setState({ active });
	}

	/**
	 * This function is only called in live edit mode when a panel is desired at a particular injection point, not
	 * at the end of the collection.
	 *
	 * @param index the index in the collection to inject a selected panel at
	 * @param position before or after injectionIndex
	 */

	@autobind
	activatePicker(index, position) {
		let injectionIndex = position === 'beforebegin' ? index : index + 1;
		if (injectionIndex < 0) {
			injectionIndex = 0;
		}
		this.setState({
			panelSetPickerActive: false,
			pickerActive: true,
			injectionIndex,
		});
	}

	/**
	 * Saves a panel set using the custom ajax util.
	 */

	@autobind
	savePanelSet() {
		events.trigger({
			event: 'modern_tribe/open_dialog',
			native: false,
			data: {
				heading: UI_I18N['dialog.panel_set_title'],
				template: 'confirmPanelSetTitle',
				confirm: true,
				largeModal: true,
				type: 'confirm',
				callback: (dialogData = {}) => {
					ajax.savePanelSet(JSON.stringify({ panels: this.props.panels }), dialogData.panelTitle)
						.done((data) => {
							this.setState({
								panelSetPickerEditLink: data.edit_url,
							});
							events.trigger({
								event: 'modern_tribe/open_dialog',
								native: false,
								data: {
									heading: UI_I18N['message.template_saved'],
								},
							});
						})
						.fail(() => {
							events.trigger({
								event: 'modern_tribe/open_dialog',
								native: false,
								data: {
									type: 'error',
									heading: UI_I18N['message.template_error'],
								},
							});
						});
				},
			},
		});
	}

	/**
	 * Toggles the sidebar in live edit mode between 300px and 700px in width.
	 */

	@autobind
	toggleLiveEditWidth() {
		if (this.sidebar.classList.contains(styles.expanded)) {
			this.sidebar.classList.remove(styles.expanded);
			this.sidebar.setAttribute('data-expanded', 'false');
		} else {
			this.sidebar.classList.add(styles.expanded);
			this.sidebar.setAttribute('data-expanded', 'true');
		}
	}

	/**
	 * If we have sets and we have no panels yet lets display the sets selector.
	 *
	 * @returns {*|boolean}
	 */

	shouldActivatePanelSets() {
		return TEMPLATES && TEMPLATES.length && !this.props.panels.length;
	}

	/**
	 * We are saving the data in the redux store to a hidden input every second for wp to pickup on whenever saves/drafts occur.
	 * Redux does a shallow compare so deep updates from fields on the nested panel data dont trigger a rerender, which is actually good.
	 * But that means we wont get auto liveupdating of the value from props and have to setup our own "heartbeat" to do it.
	 */
	runDataHeartbeat() {
		const dataInput = this.dataInput;
		this.heartbeat = setInterval(() => {
			const panels = cloneDeep(this.props.panels);
			const newData = JSON.stringify({ panels });
			if (MODULAR_CONTENT.autosave === newData) {
				return;
			}
			MODULAR_CONTENT.needs_save = true;
			MODULAR_CONTENT.autosave = newData;
			dataInput.value = newData;
		}, 1000);
	}

	heartbeat = () => {};

	/**
	 * Toggles the visibility of the panel picker and emits events.
	 *
	 * @param pickerActive {Boolean}
	 */

	@autobind
	togglePicker(pickerActive) {
		if (pickerActive) {
			this.setState({ pickerActive });
			events.trigger({ event: 'modern_tribe/picker_opened', native: false });
		} else {
			this.setState({
				pickerActive,
				injectionIndex: -1,
			});
			events.trigger({ event: 'modern_tribe/picker_closed', native: false });
		}
	}

	/**
	 * Adds a new empty panel to the redux store at requested injection index. Emits event with data as well.
	 *
	 * @param panel
	 */

	@autobind
	handleAddPanel(panel) {
		const blueprint = _.find(BLUEPRINT_TYPES, { type: panel.type });
		const data = {
			index: this.state.injectionIndex,
			panels: [{
				type: panel.type,
				depth: 0,
				data: defaultData.panel(blueprint),
			}],
		};

		this.props.addNewPanel(data);
		events.trigger({ event: 'modern_tribe/panels_added', native: false, data });
	}

	/**
	 * Injects an entire panel set into the state and triggers a ui update.
	 *
	 * @param data
	 */

	@autobind
	handleAddPanelSet(data = {}) {
		const renderData = {
			index: this.state.injectionIndex,
			panels: data,
		};

		this.setState({
			panelSetPickerActive: false,
		});
		this.props.addNewPanelSet(data);

		events.trigger({ event: 'modern_tribe/panels_added', native: false, data: renderData });
	}

	@autobind
	handleStartNewPage() {
		this.setState({
			panelSetPickerActive: false,
			pickerActive: true,
		});
	}

	@autobind
	handleDataUpdate(data = {}) {
		this.props.updatePanelData(data);
		events.trigger({ event: 'modern_tribe/panel_updated', native: false, data });
	}

	@autobind
	handlePanelsSaving(saving = false) {
		this.sidebar.setAttribute('data-saving', saving);
	}

	@autobind
	handleDeletePanel(data) {
		this.props.deletePanelAtIndex(data);
		this.setState({ keyPrefix: randomString(10) });
	}

	@autobind
	handleIframeLoaded() {
		this.collection.setAttribute('data-iframe-loading', 'false');
	}

	@autobind
	handleRefreshRateChange(e) {
		const refreshRate = parseInt(e.currentTarget.value, 10) * 1000;
		this.setState({ refreshRate });
		storage.put('modular-content-refresh-delay', refreshRate);
	}

	handleSortStart() {
		this.sidebar.classList.add(styles.sorting);
	}

	handleSortEnd() {
		this.sidebar.classList.remove(styles.sorting);
	}

	@autobind
	handleSort(e) {
		events.trigger({ event: 'modern_tribe/panel_moved', native: false, data: e });
		this.props.movePanel(e);
		this.setState({ keyPrefix: randomString(10) });
	}

	renderBar() {
		return this.state.liveEdit ? (
			<EditBar
				dataIsDirty={this.isDirty}
				handleCancelClick={this.swapEditMode}
				handleResizeClick={this.swapResizeMode}
				refreshRate={this.state.refreshRate}
				handleRefreshRateChange={this.handleRefreshRateChange}
			/>
		) : null;
	}

	renderHeader() {
		return (
			<Header
				{...this.state}
				count={this.props.panels.length}
				handleSavePanelSet={this.savePanelSet}
				handleLiveEditClick={this.swapEditMode}
				handleExpanderClick={this.toggleLiveEditWidth}
			/>
		);
	}

	renderIframe() {
		return this.state.liveEdit ? (
			<CollectionPreview
				key={`collection-preview-${this.state.refreshRate}`}
				{...this.state}
				panels={this.props.panels}
				panelsSaving={this.handlePanelsSaving}
				iframeLoaded={this.handleIframeLoaded}
				panelsActivate={this.panelsActivate}
				updatePanelOrder={this.handleSort}
				spawnPickerAtIndex={this.activatePicker}
			/>
		) : null;
	}

	renderPanels() {
		if (this.state.pickerActive || this.state.panelSetPickerActive) {
			return null;
		}

		const sortOptions = {
			animation: 150,
			handle: '.panel-row-header',
			ghostClass: styles.sortGhost,
			onStart: () => this.handleSortStart(),
			onEnd: () => this.handleSortEnd(),
			onSort: (e) => {
				this.handleSort(e);
			},
		};

		const Panels = _.map(this.props.panels, (panel, i) => {
			const blueprint = _.find(BLUEPRINT_TYPES, { type: panel.type });
			return (
				<Panel
					{...blueprint}
					{...panel}
					key={`${this.state.keyPrefix}-${i}`}
					index={i}
					liveEdit={this.state.liveEdit}
					panelsActive={this.state.active}
					panelsActivate={this.panelsActivate}
					movePanel={this.props.movePanel}
					deletePanel={this.handleDeletePanel}
					updatePanelData={this.handleDataUpdate}
					handleExpanderClick={this.toggleLiveEditWidth}
				/>
			);
		});

		return (
			<Sortable
				options={sortOptions}
			>
				{Panels}
			</Sortable>
		);
	}

	renderPicker() {
		return !this.state.panelSetPickerActive ? (
			<Picker
				activate={this.state.pickerActive}
				handlePickerUpdate={this.togglePicker}
				handleAddPanel={this.handleAddPanel}
			/>
		) : null;
	}

	renderPanelSetPicker() {
		return this.state.panelSetPickerActive ? (
			<PanelSetsPicker
				handleAddPanelSet={this.handleAddPanelSet}
				handleStartNewPage={this.handleStartNewPage}
			/>
		) : null;
	}

	render() {
		const collectionClasses = classNames({
			[styles.main]: true,
			[styles.active]: this.state.active,
			[styles.editMode]: this.state.liveEdit,
			[styles.setsActive]: this.state.panelSetPickerActive,
			'panel-collection': true,
		});

		return (
			<div
				ref={r => this.collection = r}
				className={collectionClasses}
				data-live-edit={this.state.liveEdit}
				data-live-active={this.state.active}
				data-picker-active={this.state.pickerActive}
				data-sets-active={this.state.panelSetPickerActive}
				data-iframe-loading="false"
				data-mode="full"
				data-browser={tools.browser()}
				data-os={tools.os()}
			>
				{this.renderBar()}
				<div ref={r => this.sidebar = r} className={styles.sidebar} data-expanded="false" data-saving="false">
					{this.renderHeader()}
					{this.renderPanels()}
					{this.renderPicker()}
					{this.renderPanelSetPicker()}
				</div>
				{this.renderIframe()}
				<Dialog />
			</div>
		);
	}
}

const mapStateToProps = state => ({ panels: state.panelData.panels });

const mapDispatchToProps = dispatch => ({
	movePanel: data => dispatch(movePanel(data)),
	updatePanelData: data => dispatch(updatePanelData(data)),
	addNewPanel: data => dispatch(addNewPanel(data)),
	addNewPanelSet: data => dispatch(addNewPanelSet(data)),
	deletePanelAtIndex: data => dispatch(deletePanelAtIndex(data)),
});

PanelCollection.propTypes = {
	panels: PropTypes.array,
	movePanel: PropTypes.func.isRequired,
	updatePanelData: PropTypes.func.isRequired,
	addNewPanel: PropTypes.func.isRequired,
	addNewPanelSet: PropTypes.func.isRequired,
	deletePanelAtIndex: PropTypes.func.isRequired,
};

PanelCollection.defaultProps = {
	panels: [],
	movePanel: () => {},
	updatePanelData: () => {},
	addNewPanel: () => {},
	addNewPanelSet: () => {},
	deletePanelAtIndex: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(PanelCollection);
