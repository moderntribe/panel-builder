import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './radio.pcss';

class Radio extends Component {
	state = {
		value: this.props.data,
	};

	@autobind
	handleChange(e) {
		const value = e.currentTarget.value;
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value,
		});
	}

	render() {
		const radioLabelClasses = classNames({
			[styles.radioLabel]: true,
			'plradio-label': true,
		});

		const Options = _.map(this.props.options, option => (
			<label
				className={radioLabelClasses}
				key={_.uniqueId('option-id-')}
			>
				<input
					type="radio"
					name={`modular-content-${this.props.name}`}
					value={option.value}
					tabIndex={0}
					onChange={this.handleChange}
					className={styles.radio}
					checked={this.state.value === option.value}
					data-option-type="single"
					data-field="radio"
				/>
				<span />
				{option.label}
			</label>
			),
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
			'panel-conditional-field': true,
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
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	depth: PropTypes.number,
	indexMap: PropTypes.array,
	strings: PropTypes.object,
	default: PropTypes.string,
	options: PropTypes.array,
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
};

Radio.defaultProps = {
	label: '',
	name: '',
	description: '',
	depth: 0,
	indexMap: [],
	strings: {},
	default: '',
	options: [],
	data: '',
	panelIndex: 0,
	updatePanelData: () => {},
};

export default Radio;
