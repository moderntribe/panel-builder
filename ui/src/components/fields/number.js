import React from 'react';
import PropTypes from 'prop-types';
import NumericInput from 'react-numeric-input';

import field from '../shared/field';
import * as styleUtil from '../../util/dom/styles';
import * as DATA_KEYS from '../../constants/data-keys';
import styles from './number.pcss';

export const Number = (props) => {
	const handleChange = (value) => {
		let val = value;
		if (val < props.min) {
			val = props.min;
		} else if (val > props.max) {
			val = props.max;
		}
		props.updateValue(val);
	};

	const { fieldClasses, descriptionClasses, labelClasses } = styleUtil.defaultFieldClasses(styles, props);

	return (
		<div className={fieldClasses}>
			{props.layout !== DATA_KEYS.COMPACT_LAYOUT && <label className={labelClasses}>{props.label}</label>}
			<span className={styles.container}>
				<NumericInput
					className={styles.input}
					value={props.value}
					onChange={handleChange}
					min={props.min}
					max={props.max}
					step={props.step}
					style={false} // eslint-disable-line
					snap
				/>
			</span>
			{props.layout === DATA_KEYS.COMPACT_LAYOUT && <label className={labelClasses}>{props.label}</label>}
			<p className={descriptionClasses}>{props.description}</p>
		</div>
	);
};

Number.propTypes = {
	default: PropTypes.number,
	description: PropTypes.string,
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
	updateValue: PropTypes.func,
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};

Number.defaultProps = {
	default: 0,
	description: '',
	label: '',
	layout: 'full',
	max: 0,
	min: 0,
	name: '',
	show_arrows: false,
	step: 'any',
	unit_display: 'px',
	updateValue: () => {},
	value: 0,
};

export default field(Number);
