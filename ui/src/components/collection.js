import React, { Component } from 'react';
import _ from 'lodash';

import blueprint from '../data/blueprint.json';
import Panel from './panel';

import styles from './collection.pcss';

export default class PanelCollection extends Component {
	componentDidMount() {
		// code
	}

	render() {
		const Panels = _.map(blueprint, (panelBlueprint) => <Panel {...panelBlueprint} key={_.uniqueId('panel-id-')} />);

		return (
			<div className={styles.main}>
				{Panels}
			</div>
		);
	}
}
