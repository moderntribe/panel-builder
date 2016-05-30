import React, { Component, PropTypes } from 'react';
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

	getFields(){
		let FieldContainer = null;
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
					<Field
						{...field}
						data={this.props.data[field.name]}
					/>
				</div>
			);
		}) : null;

		if (this.state.active) {
			const fieldClasses = classNames({
				[styles.panelFields]: true,
				'panel-row-fields': true,
			});
			FieldContainer = (
				<div className={fieldClasses}>
					{Fields}
				</div>
			);
		}

		return FieldContainer;
	}

	render() {
		const wrapperClasses = classNames({
			[styles.panelRow]: true,
			[`panel-type-${this.props.type}`]: true,
		});
		const headerClasses = classNames({
			[styles.panelHeader]: true,
			'panel-row-header': true,
		});

		return (
			<div className={wrapperClasses}>
				<div className={headerClasses} onClick={this.handleClick}>
					<h3>{this.props.label}</h3>
				</div>
				{this.getFields()}
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
	movePanel: PropTypes.func,
	updatePanelData: PropTypes.func,
};

PanelContainer.defaultProps = {
	data: {},
	label: '',
	type: '',
	description: '',
	icon: {},
	fields: [],
	movePanel: () => {},
	updatePanelData: () => {},
};

export default PanelContainer;
