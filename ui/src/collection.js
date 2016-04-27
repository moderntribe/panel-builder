import React, { Component } from 'react';

import blueprint from './data/blueprint';

import PanelContainer from './container';

export default class App extends Component {
	render() {

		const Panels = _.map(blueprint, (panelBlueprint) => {
			return <PanelContainer {...panelBlueprint} key={_.uniqueId( 'panel-id-' )}/>;
		});

		return (
			<div className='panel-collection'>
				<h1>Panel Prototyping</h1>
				{Panels}
			</div>
		);
	}
}
