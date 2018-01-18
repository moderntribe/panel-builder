import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Slider from 'rc-slider/lib/Slider';
import RangeSlider from 'rc-slider/lib/Range';
import NumericInput from 'react-numeric-input';

import field from '../shared/field';
import * as styleUtil from '../../util/dom/styles';
import styles from './number.pcss';

export const Range = (props) => {
	const handleChange = (value) => {
		let arr = [];
		if (_.isArray(value)) {
			arr = value.filter(Number);
		} else {
			arr.push(value);
		}
		console.log(arr);
		props.updateValue(arr);
	};

	const { fieldClasses, descriptionClasses, labelClasses } = styleUtil.defaultFieldClasses(styles);

	return (
		<div className={fieldClasses}>
			<label className={labelClasses}>{props.label}</label>
			<span className={styles.container}>
				{props.handles.length === 1 &&
					<Slider
						min={props.min}
						max={props.max}
						step={props.step}
						value={props.value[0]}
						onChange={handleChange}
					/>
				}
				{props.handles.length > 1 &&
					<RangeSlider

					/>
				}
				{props.has_input && props.handles.length === 1 &&
					<NumericInput
						className={styles.input}
						value={props.value[0]}
						onChange={handleChange}
						min={props.min}
						max={props.max}
						step={props.step}
						style={false} // eslint-disable-line
						snap
					/>
				}
			</span>
			<p className={descriptionClasses}>{props.description}</p>
		</div>
	);
};

Range.propTypes = {
	default: PropTypes.array,
	description: PropTypes.string,
	handles: PropTypes.array,
	has_input: PropTypes.bool,
	label: PropTypes.string,
	max: PropTypes.number,
	min: PropTypes.number,
	name: PropTypes.string,
	step: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	unit_display: PropTypes.string,
	updateValue: PropTypes.func,
	value: PropTypes.array,
};

Range.defaultProps = {
	default: [],
	description: '',
	handles: [],
	has_input: false,
	label: '',
	max: 0,
	min: 0,
	name: '',
	step: 'any',
	unit_display: 'px',
	updateValue: () => {},
	value: [],
};

export default field(Range);
