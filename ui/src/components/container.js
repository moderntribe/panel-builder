import React, { Component } from 'react';
import _ from 'lodash';

import componentMap from './fields/component-map';

export default class PanelContainer extends Component {
	render() {

		const Fields = _.map(this.props.fields, (item) => {
			const Field = componentMap[item.field];
			if (!Field) {
				return null;
			}
			return <Field {...item} key={_.uniqueId( 'field-id-' )}/>;
		});

		return (
			<div className='panel'>
				{Fields}
			</div>
		);
	}
}

PanelContainer.propTypes = {
	title: React.PropTypes.string,
	name: React.PropTypes.string,
	fields: React.PropTypes.array
};

PanelContainer.defaultProps = {
	title: '',
	name: '',
	fields: []
};

export default PanelContainer;
