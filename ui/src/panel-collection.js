import React, { Component } from 'react';

import blueprint from './data/blueprint';

import Layout from './layout';
import PanelContainer from './panel-container';

export default class App extends Component {
	render() {

		const Panels = _.map(blueprint, (panelBlueprint) => {
			return <PanelContainer {...panelBlueprint} key={_.uniqueId( 'panel-id-' )}/>;
		});

		return (
			<Layout>
				{Panels}
			</Layout>
		);
	}
}
