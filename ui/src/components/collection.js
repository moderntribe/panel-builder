import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import { updatePanelData, movePanel, addNewPanel } from '../actions/panels';
import { UI_I18N } from '../globals/i18n';
import { MODULAR_CONTENT, BLUEPRINTS } from '../globals/config';

import Panel from './panel';
import Button from './shared/button';
import EditBar from './collection-edit-bar';
import Picker from './picker';
import PanelSetsPicker from './panel-sets-picker';
import styles from './collection.pcss';

class PanelCollection extends Component {
	state = {
		active: false,
		paneSetPickerActive: false,
		pickerActive: false,
		liveEdit: false,
		mode: 'full',
		editText: UI_I18N['button.launch_edit'],
	};

	componentDidMount() {
		this.runDataHeartbeat();
	}

	componentWillUnmount() {
		clearInterval(this.heartbeat);
	}

	getBar() {
		return this.state.liveEdit ? (
			<EditBar
				handleCancelClick={this.swapEditMode}
				handleResizeClick={this.swapResizeMode}
			/>
		) : null;
	}

	getIframe() {
		const iframeClasses = classNames({
			[styles.iframeFull]: this.state.mode === 'full',
			[styles.iframeTablet]: this.state.mode === 'tablet',
			[styles.iframeMobile]: this.state.mode === 'mobile',
			'panel-preview-iframe': true,
		});
		
		return this.state.liveEdit ? (
			<div className={styles.iframe}>
				<div className={styles.loaderWrap}><i className={styles.loader} /></div>
				<iframe className={iframeClasses} src={MODULAR_CONTENT.preview_url} />
			</div>
		) : null;
	}

	getPanels() {
		return !this.state.pickerActive ? _.map(this.props.panels, (panel, i) => {
			const blueprint = _.find(BLUEPRINTS, { type: panel.type });
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
				/>
			);
		}) : null;
	}

	@autobind
	swapEditMode() {
		this.setState({ liveEdit: !this.state.liveEdit });
	}
	
	@autobind
	swapResizeMode(mode) {
		this.setState({ mode });
	}

	@autobind
	panelsActive(active) {
		this.setState({ active });
	}

	/**
	 * We are saving the data in the redux store to a hidden input every second for wp to pickup on whenever saves/drafts occur.
	 * Redux does a shallow compare so deep updates from fields on the nested panel data dont trigger a rerender, which is actually good.
	 * But that means we wont get auto liveupdating of the value from props and have to setup our own "heartbeat" to do it.
	 */
	runDataHeartbeat() {
		const dataInput = ReactDOM.findDOMNode(this.refs.data);
		let oldData = JSON.stringify({ panels: this.props.panels });
		this.heartbeat = setInterval(() => {
			const newData = JSON.stringify({ panels: this.props.panels });
			if (oldData === newData) {
				return;
			}
			oldData = newData;
			dataInput.value = newData;
		}, 1000);
	}

	heartbeat = () => {};

	@autobind
	togglePicker(pickerActive) {
		this.setState({ pickerActive });
	}

	renderPanelSetPicker() {


	}

	renderEditLaunch() {
		let EditLaunch = null;
		if (!this.state.liveEdit) {
			EditLaunch = (
				<Button
					text={UI_I18N['button.launch_edit']}
					handleClick={this.swapEditMode}
					icon="dashicons-welcome-view-site"
					bare
					classes={styles.editButton}
				/>
			);
		}

		return EditLaunch;
	}

	render() {
		const collectionClasses = classNames({
			[styles.main]: true,
			[styles.active]: this.state.active,
			[styles.editMode]: this.state.liveEdit,
			'panel-collection': true,
		});

		const showPanelSet = this.props.panels.length==0;

		return (
			<div className={collectionClasses} data-live-edit={this.state.liveEdit} data-live-active={this.state.active}>
				{this.getBar()}
				<div className={styles.sidebar}>
					{this.getPanels()}
					{!showPanelSet && <Picker
						handlePickerUpdate={this.togglePicker}
						handleAddPanel={this.props.addNewPanel}
					/>}
					{showPanelSet && <PanelSetsPicker />}
					{this.renderEditLaunch()}
				</div>
				{this.getIframe()}
				<input ref="data" type="hidden" name="panels" id="panels" value={JSON.stringify({ panels: this.props.panels })} />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({ panels: state.panelData.panels });

const mapDispatchToProps = (dispatch) => ({
	movePanel: (data) => dispatch(movePanel(data)),
	updatePanelData: (data) => dispatch(updatePanelData(data)),
	addNewPanel: (data) => dispatch(addNewPanel(data)),
});

PanelCollection.propTypes = {
	panels: PropTypes.array,
	movePanel: PropTypes.func.isRequired,
	updatePanelData: PropTypes.func.isRequired,
	addNewPanel: PropTypes.func.isRequired,
};

PanelCollection.defaultProps = {
	panels: [],
	movePanel: () => {},
	updatePanelData: () => {},
	addNewPanel: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(PanelCollection);
