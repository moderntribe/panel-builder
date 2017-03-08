import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import ReactSelect from 'react-select-plus';
import classNames from 'classnames';
import styles from './select.pcss';

class Select extends Component {
	state = {
		// todo: a bug in react select plus causes int values to not render the initial value
		value: this.props.data && this.props.data.length ? _.toString(this.props.data) : _.toString(this.props.default),
	};

	getStringTypedOptions() {
		return this.props.options.map(option => ({
			label: option.label,
			value: _.toString(option.value),
		}));
	}

	@autobind
	handleChange(data) {
		const value = data ? _.toString(data.value) : _.toString(this.props.default);
		const typedValue = isNaN(value) ? value : parseInt(value, 10);

		this.setState({ value });

		this.props.updatePanelData({
			index: this.props.panelIndex,
			name: this.props.name,
			value: typedValue,
		});
	}

	render() {
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
			'panel-conditional-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<ReactSelect
					name={`modular-content-${this.props.name}`}
					options={this.getStringTypedOptions()}
					onChange={this.handleChange}
					value={this.state.value}
				/>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Select.propTypes = {
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.object,
	default: PropTypes.string,
	options: PropTypes.array,
	updatePanelData: PropTypes.func,
};

Select.defaultProps = {
	data: '',
	panelIndex: 0,
	label: '',
	name: '',
	description: '',
	strings: {},
	default: '',
	options: [],
	updatePanelData: () => {},
};

export default Select;
