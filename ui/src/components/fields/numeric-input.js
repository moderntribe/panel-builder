import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import ReactNumericInput from 'react-numeric-input';

import * as styleUtil from '../../util/dom/styles';
import * as DATA_KEYS from '../../constants/data-keys';
import styles from './numeric-input.pcss';

class NumericInput extends Component {
	state = {
		value: this.props.data,
	};

	@autobind
	handleChange(value) {
		if (value < this.props.min || value > this.props.max) {
			return;
		}
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value,
		});
	}

	render() {
		const { fieldClasses, descriptionClasses, labelClasses } = styleUtil.defaultFieldClasses(styles, this.props);

		return (
			<div className={fieldClasses}>
				{this.props.layout !== DATA_KEYS.COMPACT_LAYOUT &&
				<label className={labelClasses}>{this.props.label}</label>}
				<span className={styles.container}>
					<ReactNumericInput
						className={styles.input}
						value={this.state.value}
						onChange={this.handleChange}
						min={this.props.min}
						max={this.props.max}
						step={this.props.step}
						style={false} // eslint-disable-line
						snap
					/>
				</span>
				{this.props.layout === DATA_KEYS.COMPACT_LAYOUT &&
				<label className={labelClasses}>{this.props.label}</label>}
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

NumericInput.propTypes = {
	data: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	default: PropTypes.number,
	depth: PropTypes.number,
	description: PropTypes.string,
	indexMap: PropTypes.array,
	label: PropTypes.string,
	layout: PropTypes.string,
	max: PropTypes.number,
	min: PropTypes.number,
	name: PropTypes.string,
	show_arrows: PropTypes.bool,
	step: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	unit_display: PropTypes.string,
	updatePanelData: PropTypes.func,
};

NumericInput.defaultProps = {
	data: 0,
	default: 0,
	depth: 0,
	description: '',
	indexMap: [],
	label: '',
	layout: 'full',
	max: 0,
	min: 0,
	name: '',
	show_arrows: false,
	step: 'any',
	unit_display: 'px',
	updatePanelData: () => {},
};

export default NumericInput;
