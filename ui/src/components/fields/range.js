import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import Slider from 'rc-slider';
import NumericInput from 'react-numeric-input';
import Tooltip from 'rc-tooltip';

import * as styleUtil from '../../util/dom/styles';
import LabelTooltip from './partials/label-tooltip';
import styles from './range.pcss';

const { createSliderWithTooltip } = Slider;
const RangeSlider = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

const handle = (props) => {
	const { value, dragging, index, ...restProps } = props; // eslint-disable-line
	return (
		<Tooltip
			prefixCls="rc-slider-tooltip"
			overlay={value}
			visible={dragging}
			placement="top"
			key={index}
		>
			<Handle value={value} {...restProps} />
		</Tooltip>
	);
};

class Range extends Component {
	state = {
		value: this.props.data,
	};

	@autobind
	handleChange(value) {
		let arr = [];
		if (_.isArray(value)) {
			arr = value.filter(Number);
		} else {
			arr.push(value);
		}
		this.setState({ value: arr });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value: arr,
		});
	}

	render() {
		const { fieldClasses, labelClasses } = styleUtil.defaultFieldClasses(styles);

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>
				<span className={styles.container}>
					{this.props.handles.length === 1 &&
					<Slider
						min={this.props.min}
						max={this.props.max}
						step={this.props.step}
						value={this.state.value[0]}
						handle={handle}
						onChange={this.handleChange}
						tipFormatter={value => `${value}${this.props.unit_display}`}
					/>
					}
					{this.props.handles.length > 1 &&
					<RangeSlider
						handles={this.props.handles}
						min={this.props.min}
						max={this.props.max}
						step={this.props.step}
						value={this.state.value}
						onChange={this.handleChange}
						tipFormatter={value => `${value}${this.props.unit_display}`}
					/>
					}
					{this.props.has_input && this.props.handles.length === 1 &&
					<NumericInput
						className={styles.input}
						value={this.state.value[0]}
						onChange={this.handleChange}
						min={this.props.min}
						max={this.props.max}
						step={this.props.step}
						style={false} // eslint-disable-line
						snap
					/>
					}
				</span>
			</div>
		);
	}
}

Range.propTypes = {
	data: PropTypes.array,
	default: PropTypes.array,
	description: PropTypes.string,
	depth: PropTypes.number,
	handles: PropTypes.array,
	has_input: PropTypes.bool,
	indexMap: PropTypes.array,
	label: PropTypes.string,
	max: PropTypes.number,
	min: PropTypes.number,
	name: PropTypes.string,
	step: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	unit_display: PropTypes.string,
	updatePanelData: PropTypes.func,
};

Range.defaultProps = {
	data: [],
	default: [],
	description: '',
	depth: 0,
	handles: [],
	has_input: false,
	indexMap: [],
	label: '',
	max: 0,
	min: 0,
	name: '',
	step: 'any',
	unit_display: 'px',
	updatePanelData: () => {},
};

export default Range;
