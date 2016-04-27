import React, { Component } from 'react';

import componentMap from './component-map';

class Repeater extends Component {

	constructor(props) {
		super(props);
		this.addRepeaterGroup = this.addRepeaterGroup.bind(this);
	}

	addRepeaterGroup() {}

	render() {
		// i am just rendering for now as proof of concept. but in fact we want to call the injection from map on 'add' click or initial data render

		const Fields = _.map(this.props.fields, (item) => {
			const Field = componentMap[item.field];
			if (!Field) {
				return null;
			}
			return (
				<Field {...item} key={_.uniqueId('field-id-')} />
			);
		});

		return (
			<div className="panel-field">
				{Fields}
				<button className="repeater-add" onClick={this.addRepeaterGroup}>{this.props.addText}</button>
			</div>
		);
	}
}

Repeater.propTypes = {
	name: React.PropTypes.string,
	fields: React.PropTypes.array,
	title: React.PropTypes.string,
	addText: React.PropTypes.string,
};

Repeater.defaultProps = {
	name: '',
	title: '',
	fields: [],
	addText: 'Add Row',
};

export default Repeater;
