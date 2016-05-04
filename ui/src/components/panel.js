import React, { Component } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import componentMap from './fields/component-map';

import styles from './panel.pcss';

export default class PanelContainer extends Component {
	render() {
		const Fields = _.map(this.props.fields, (field) => {
			const Field = componentMap[field.type.replace(/\\/g, '')];
			if (!Field) {
				return null;
			}

			return <Field {...field} key={_.uniqueId('field-id-')}/>;
		});

		const classes = classNames(
			styles.panelRow,
			`panel-type-${this.props.type}`
		);

		return (
			<div className={classes}>
				{Fields}
			</div>
		);
	}
}

PanelContainer.propTypes = {
	label: React.PropTypes.string,
	type: React.PropTypes.string,
	description: React.PropTypes.string,
	icon: React.PropTypes.object,
	fields: React.PropTypes.array,
};

PanelContainer.defaultProps = {
	label: '',
	type: '',
	description: '',
	icon: {},
	fields: [],
};

export default PanelContainer;
