import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactNumericInput from 'react-numeric-input';

import LabelTooltip from './partials/label-tooltip';
import * as styleUtil from '../../util/dom/styles';
import * as DATA_KEYS from '../../constants/data-keys';
import styles from './numeric-input.pcss';

class NumericInput extends Component {
	constructor(props) {
		super(props);
		this.handleChange = _.debounce(this.handleChange.bind(this), 450);
		this.state = {
			value: this.props.data,
		};
	}

	handleChange(initialValue) {
		if (!initialValue) {
			return;
		}
		if (initialValue < this.props.min || initialValue > this.props.max) {
			return;
		}
		let value = initialValue;
		if (_.isInteger(this.props.step)) {
			value = Math.round(value / this.props.step) * this.props.step;
		}
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
			name: this.props.name,
			value,
		});
	}

	render() {
		const { fieldClasses, labelClasses } = styleUtil.defaultFieldClasses(styles, this.props);

		return (
			<div className={fieldClasses}>
				{this.props.layout !== DATA_KEYS.COMPACT_LAYOUT &&
				<label className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>}
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
	parentMap: PropTypes.array,
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
	parentMap: [],
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
