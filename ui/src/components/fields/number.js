import React from 'react';
import PropTypes from 'prop-types';

import field from '../shared/field';
import * as styleUtil from '../../util/dom/styles';
import styles from './number.pcss';

export const Number = (props) => {
	const handleChange = (e) => {
		props.updateValue(e.currentTarget.value);
	};
	const { fieldClasses, descriptionClasses, labelClasses } = styleUtil.defaultFieldClasses(styles);

	return (
		<div className={fieldClasses}>
			<label className={labelClasses}>{props.label}</label>
			<span className={styles.container}>
				<input
					className={styles.input}
					type="number"
					value={props.value}
					onChange={handleChange}
					min={props.min}
					max={props.max}
					step={props.step}
				/>
			</span>
			<p className={descriptionClasses}>{props.description}</p>
		</div>
	);
};

Number.propTypes = {
	default: PropTypes.number,
	description: PropTypes.string,
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
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};

Number.defaultProps = {
	default: 0,
	description: '',
	label: '',
	max: 0,
	min: 0,
	name: '',
	step: 'any',
	unit_display: 'px',
	updateValue: () => {},
	value: 0,
};

export default field(Number);
