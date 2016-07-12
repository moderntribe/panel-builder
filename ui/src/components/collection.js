import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import { updatePanelData, movePanel, addNewPanel, addNewPanelSet } from '../actions/panels';
import { MODULAR_CONTENT, BLUEPRINT_TYPES, TEMPLATES } from '../globals/config';

import Panel from './panel';
import Header from './collection-header';
import EditBar from './collection-edit-bar';
import CollectionPreview from './collection-preview';
import Picker from './panel-picker';
import PanelSetsPicker from './panel-sets-picker';
import styles from './collection.pcss';

import * as ajax from '../util/ajax';
import * as heartbeat from '../util/data/heartbeat';

class PanelCollection extends Component {
	state = {
		active: false,
		panelSetModalIsOpen: false,
		panelSetSaveError: false,
		panelSetPickerActive: false,
		panelSetPickerEditLink: '',
		pickerActive: false,
		liveEdit: false,
		mode: 'full',
	};

	componentWillMount() {
		if (!this.shouldActivatePanelSets()) {
			return;
		}

		this.setState({
			panelSetPickerActive: true,
		});
	}

	componentDidMount() {
		this.sidebar = ReactDOM.findDOMNode(this.refs.sidebar);
		this.bindEvents();
	}

	componentWillUpdate(nextProps, nextState) {
		this.handleModalOpenUi(nextState);
	}

	componentWillUnmount() {
		this.unBindEvents();
		heartbeat.destroy();
	}

	bindEvents() {
		MODULAR_CONTENT.autosave = JSON.stringify({ panels: this.props.panels });
		MODULAR_CONTENT.needs_save = false;
		this.runDataHeartbeat();
		heartbeat.init({
			success: this.handleAutosaveSuccess,
		});
	}

	unBindEvents() {
		clearInterval(this.heartbeat);
	}

	handleModalOpenUi(nextState) {
		const wpWrap = document.getElementById('wpwrap');
		if (nextState.panelSetModalIsOpen) {
			wpWrap.classList.add(styles.modalBlur);
		} else {
			wpWrap.classList.remove(styles.modalBlur);
		}
	}

	@autobind
	handleAutosaveSuccess() {
		if (this.triggerLiveEdit) {
			this.triggerLiveEdit = false;
			this.setState({ liveEdit: true });
		}
	}

	@autobind
	swapEditMode() {
		if (this.state.liveEdit) {
			this.setState({ liveEdit: false });
		} else {
			if (MODULAR_CONTENT.needs_save) {
				this.triggerLiveEdit = true;
				heartbeat.triggerAutosave();
			} else {
				this.setState({ liveEdit: true });
			}
		}
	}

	@autobind
	swapResizeMode(mode) {
		this.setState({ mode });
	}

	@autobind
	panelsActive(active) {
		// reset the sidebar to top when animating in children
		if (active) {
			this.sidebar.scrollTop = 0;
		}
		this.setState({ active });
	}

	@autobind
	savePanelSet() {
		ajax.savePanelSet(JSON.stringify({ panels: this.props.panels }))
			.done((data) => {
				this.setState({
					panelSetModalIsOpen: true,
					panelSetPickerEditLink: data.edit_url,
					panelSetSaveError: false,
				});
			})
			.fail(() => {
				this.setState({
					panelSetModalIsOpen: true,
					panelSetPickerEditLink: '',
					panelSetSaveError: true,
				});
			});
	}

	@autobind
	closePanelSetModal() {
		this.setState({
			panelSetModalIsOpen: false,
			panelSetSaveError: false,
		});
	}

	@autobind
	toggleLiveEditWidth() {
		this.sidebar.classList.toggle(styles.expanded);
	}

	shouldActivatePanelSets() {
		return TEMPLATES && TEMPLATES.length && !this.props.panels.length;
	}

	/**
	 * We are saving the data in the redux store to a hidden input every second for wp to pickup on whenever saves/drafts occur.
	 * Redux does a shallow compare so deep updates from fields on the nested panel data dont trigger a rerender, which is actually good.
	 * But that means we wont get auto liveupdating of the value from props and have to setup our own "heartbeat" to do it.
	 */
	runDataHeartbeat() {
		const dataInput = ReactDOM.findDOMNode(this.refs.data);
		this.heartbeat = setInterval(() => {
			const newData = JSON.stringify({ panels: this.props.panels });
			if (MODULAR_CONTENT.autosave === newData) {
				return;
			}
			MODULAR_CONTENT.needs_save = true;
			MODULAR_CONTENT.autosave = newData;
			dataInput.value = newData;
		}, 1000);
	}

	heartbeat = () => {};

	@autobind
	togglePicker(pickerActive) {
		this.setState({ pickerActive });
	}

	@autobind
	handleAddPanelSet(data = {}) {
		this.setState({
			panelSetPickerActive: false,
		});
		this.props.addNewPanelSet(data);
	}

	@autobind
	handleStartNewPage() {
		this.setState({
			panelSetPickerActive: false,
			pickerActive: true,
		});
	}

	renderBar() {
		return this.state.liveEdit ? (
			<EditBar
				handleCancelClick={this.swapEditMode}
				handleResizeClick={this.swapResizeMode}
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
				closeModal={this.closePanelSetModal}
			/>
		);
	}

	renderIframe() {
		const iframeClasses = classNames({
			[styles.iframeFull]: this.state.mode === 'full',
			[styles.iframeTablet]: this.state.mode === 'tablet',
			[styles.iframeMobile]: this.state.mode === 'mobile',
			'panel-preview-iframe': true,
		});

		return this.state.liveEdit ? (
			<CollectionPreview {...this.state} panels={this.props.panels} />
		) : null;
	}

	renderPanels() {
		return !this.state.pickerActive ? _.map(this.props.panels, (panel, i) => {
			const blueprint = _.find(BLUEPRINT_TYPES, { type: panel.type });
			return (
				<Panel
					{...blueprint}
					{...panel}
					key={`panel-${i}`}
					index={i}
					panelCount={this.props.panels.length}
					liveEdit={this.state.liveEdit}
					panelsActive={this.panelsActive}
					movePanel={this.props.movePanel}
					updatePanelData={this.props.updatePanelData}
					handleExpanderClick={this.toggleLiveEditWidth}
				/>
			);
		}) : null;
	}

	renderPicker() {
		return !this.state.panelSetPickerActive ? (
			<Picker
				activate={this.state.pickerActive}
				handlePickerUpdate={this.togglePicker}
				handleAddPanel={this.props.addNewPanel}
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

	renderDataStorageInput() {
		return (
			<input
				ref="data"
				type="hidden"
				name="panels"
				id="panels"
				value={JSON.stringify({ panels: this.props.panels })}
			/>
		);
	}

	render() {
		const collectionClasses = classNames({
			[styles.main]: true,
			[styles.active]: this.state.active,
			[styles.editMode]: this.state.liveEdit,
			[styles.expanded]: this.state.sidebarExpanded,
			[styles.setsActive]: this.state.panelSetPickerActive,
			'panel-collection': true,
		});

		return (
			<div
				className={collectionClasses}
				data-live-edit={this.state.liveEdit}
				data-live-active={this.state.active}
				data-picker-active={this.state.pickerActive}
				data-sets-active={this.state.panelSetPickerActive}
			>
				{this.renderBar()}
				<div ref="sidebar" className={styles.sidebar}>
					{this.renderHeader()}
					{this.renderPanels()}
					{this.renderPicker()}
					{this.renderPanelSetPicker()}
				</div>
				{this.renderIframe()}
				{this.renderDataStorageInput()}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({ panels: state.panelData.panels });

const mapDispatchToProps = (dispatch) => ({
	movePanel: (data) => dispatch(movePanel(data)),
	updatePanelData: (data) => dispatch(updatePanelData(data)),
	addNewPanel: (data) => dispatch(addNewPanel(data)),
	addNewPanelSet: (data) => dispatch(addNewPanelSet(data)),
});

PanelCollection.propTypes = {
	panels: PropTypes.array,
	movePanel: PropTypes.func.isRequired,
	updatePanelData: PropTypes.func.isRequired,
	addNewPanel: PropTypes.func.isRequired,
	addNewPanelSet: PropTypes.func.isRequired,
};

PanelCollection.defaultProps = {
	panels: [],
	movePanel: () => {},
	updatePanelData: () => {},
	addNewPanel: () => {},
	addNewPanelSet: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(PanelCollection);
