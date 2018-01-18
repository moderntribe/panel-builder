import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import field from '../shared/field';
import * as styleUtil from '../../util/dom/styles';
import styles from './toggle.pcss';

export const Toggle = (props) => {
	const handleChange = e => props.updateValue(parseInt(e.currentTarget.value, 10) === 0 ? 1 : 0);

	const renderOptions = () => {
		const toggleLabelClasses = classNames({
			'modular-content-toggle-label': false,
			'toggle': true,
			[styles.toggleLabel]: true,
		});

		const sliderClasses = classNames({
			[styles.toggleSlider]: true,
		});

		return (
			<label
				className={toggleLabelClasses}
			>
				<input
					type="checkbox"
					value={props.value}
					tabIndex={0}
					name={`modular-content-${props.name}`}
					className={styles.toggleInput}
					onChange={handleChange}
					checked={props.value === 1}
				/>
				<div
					className={sliderClasses}
				/>
				<span />
			</label>
		);
	};

	const { fieldClasses, descriptionClasses, labelClasses } = styleUtil.defaultFieldClasses(styles);

	return (
		<div className={fieldClasses}>
			<label className={labelClasses}>{props.label}</label>
			<div className={styles.container}>
				{renderOptions()}
			</div>
			<p className={descriptionClasses}>{props.description}</p>
		</div>
	);
};

Toggle.propTypes = {
	default: PropTypes.number,
	description: PropTypes.string,
	label: PropTypes.string,
	name: PropTypes.string,
	options: PropTypes.array,
	updateValue: PropTypes.func,
	value: PropTypes.number,
};

Toggle.defaultProps = {
	default: 0,
	description: '',
	label: '',
	name: '',
	options: [],
	updateValue: () => {},
	value: 0,
};

export default field(Toggle);
