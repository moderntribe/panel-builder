import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import { updatePanelData, movePanel } from '../actions/panels';
import { UI_I18N } from '../globals/i18n';

import Panel from './panel';
import Button from './shared/button';
import EditBar from './collection-edit-bar';
import blueprints from '../data/blueprint-multi.json';
import styles from './collection.pcss';

class PanelCollection extends Component {
	state = {
		active: false,
		liveEdit: false,
		editText: UI_I18N.btn_launch_edit,
	};

	componentDidMount() {
		this.runDataHeartbeat();
	}

	componentWillUnmount() {
		clearInterval(this.heartbeat);
	}

	getBar() {
		return this.state.liveEdit ? <EditBar /> : null;
	}

	getIframe() {
		return this.state.liveEdit ? (
			<div className={styles.iframe}>
				<iframe src={window.ModularContent.preview_url} />
			</div>
		) : null;
	}

	getPanels() {
		return _.map(this.props.panels, (panel, i) => {
			const blueprint = _.find(blueprints, { type: panel.type });
			return (
				<Panel
					{...blueprint}
					{...panel}
					key={`panel-${i}`}
					index={i}
					panelsActive={this.panelsActive}
					movePanel={this.props.movePanel}
					updatePanelData={this.props.updatePanelData}
				/>
			);
		});
	}

	@autobind
	swapEditMode() {
		this.setState({ liveEdit: !this.state.liveEdit });
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
		let oldData = JSON.stringify(this.props.panels);
		this.heartbeat = setInterval(() => {
			const newData = JSON.stringify(this.props.panels);
			if (oldData === newData) {
				return;
			}
			oldData = newData;
			dataInput.value = newData;
		}, 1000);
	}

	heartbeat = () => {};

	render() {
		const collectionClasses = classNames({
			[styles.main]: true,
			[styles.active]: this.state.active,
			[styles.editMode]: this.state.liveEdit,
			'panel-collection': true,
		});

		return (
			<div className={collectionClasses}>
				{this.getBar()}
				<div className={styles.sidebar}>
					{this.getPanels()}
					<Button
						text={this.state.editText}
						primary={false}
						handleClick={this.swapEditMode}
					/>
				</div>
				{this.getIframe()}
				<input ref="data" type="hidden" name="panels" value={JSON.stringify(this.props.panels)} />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({ panels: state.panelData.panels });

const mapDispatchToProps = (dispatch) => ({
	movePanel: (data) => dispatch(movePanel(data)),
	updatePanelData: (data) => dispatch(updatePanelData(data)),
});

PanelCollection.propTypes = {
	panels: PropTypes.array,
	movePanel: PropTypes.func.isRequired,
	updatePanelData: PropTypes.func.isRequired,
};

PanelCollection.defaultProps = {
	panels: [],
	movePanel: () => {},
	updatePanelData: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(PanelCollection);
