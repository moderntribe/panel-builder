import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { updatePanelData, movePanel } from '../actions/panels';

import Panel from './panel';
import blueprints from '../data/blueprint-multi.json';
import styles from './collection.pcss';

const PanelCollection = (props) => {
	const Panels = _.map(props.panels, (panel, i) => {
		const blueprint = _.find(blueprints, { type: panel.type });
		return (
			<Panel
				{...blueprint}
				data={panel.data}
				key={`panel-${i}`}
				movePanel={props.movePanel}
				updatePanelData={props.updatePanelData}
			/>
		);
	});

	return (
		<div className={styles.main}>
			{Panels}
		</div>
	);
};

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
