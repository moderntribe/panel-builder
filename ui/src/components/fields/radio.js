import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './radio.pcss';

class Radio extends Component {
	state = {
		value: this.props.data.length ? this.props.data : this.props.default,
	};

	@autobind
	handleChange(e) {
		const value = e.currentTarget.value;
		this.setState({ value });
		this.props.updatePanelData({
			index: this.props.panelIndex,
			name: this.props.name,
			value,
		});
	}

	render() {
		const radioLabelClasses = classNames({
			[styles.radioLabel]: true,
			'plradio-label': true,
		});

		const Options = _.map(this.props.options, (option) =>
			<label
				className={radioLabelClasses}
				key={_.uniqueId('option-id-')}
			>
				<input
					type="radio"
					name={this.props.name}
					value={option.value}
					onChange={this.handleChange}
					checked={this.state.value === option.value}
				/>
				{option.label}
			</label>
		);
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
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				{Options}
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Radio.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.object,
	default: React.PropTypes.string,
	options: React.PropTypes.array,
	data: React.PropTypes.string,
	panelIndex: React.PropTypes.number,
	updatePanelData: React.PropTypes.func,
};

Radio.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: {},
	default: '',
	options: [],
	data: '',
	panelIndex: 0,
	updatePanelData: () => {},
};

export default Radio;
