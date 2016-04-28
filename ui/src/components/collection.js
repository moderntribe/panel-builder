import React, { Component } from 'react';

import blueprint from '../data/blueprint';
import PanelContainer from './container';

import styles from './collection.pcss';

export default class PanelCollection extends Component {
	render() {

		const Panels = _.map(blueprint, (panelBlueprint) => {
			return <PanelContainer {...panelBlueprint} key={_.uniqueId( 'panel-id-' )}/>;
		});

		return (
			<div className={styles.main}>
				<h1>Panel Dev</h1>
				{Panels}
			</div>
		);
	}
};
