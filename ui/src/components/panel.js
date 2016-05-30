import React, { Component } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import autobind from 'autobind-decorator';

import componentMap from './fields/component-map';

import styles from './panel.pcss';

class PanelContainer extends Component {
	state = {
		active: false,
	};

	@autobind
	handleClick(){
		this.setState({
			active: !this.state.active,
		});
	}

	render() {
		const Fields = this.state.active ? _.map(this.props.fields, (field) => {
			const Field = componentMap[field.type.replace(/\\/g, '')];
			if (!Field) {
				return null;
			}

			const classes = classNames({
				[styles.field]: true,
				'panel-input': true,
				[`input-name-${field.name.toLowerCase()}`]: true,
				[`input-type-${field.type.toLowerCase()}`]: true,
			});

			return (
				<div className={classes} key={_.uniqueId('field-id-')}>
					<Field {...field} data={this.props.data[field.name]} />
				</div>
			);
		}) : null;

		const classes = classNames(
			styles.panelRow,
			`panel-type-${this.props.type}`
		);

		return (
			<div className={classes}>
				<div className="panel-row-header" onClick={this.handleClick}>
					Panel Header Test
				</div>
				{Fields}
			</div>
		);
	}
}

PanelContainer.propTypes = {
	data: React.PropTypes.object,
	label: React.PropTypes.string,
	type: React.PropTypes.string,
	description: React.PropTypes.string,
	icon: React.PropTypes.object,
	fields: React.PropTypes.array,
};

PanelContainer.defaultProps = {
	data: {},
	label: '',
	type: '',
	description: '',
	icon: {},
	fields: [],
};

export default PanelContainer;
