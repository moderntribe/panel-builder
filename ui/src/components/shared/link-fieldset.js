import React, { PropTypes } from 'react';
import ReactSelect from 'react-select-plus';
import classNames from 'classnames';
import styles from './link-fieldset.pcss';

const TARGET_OPTIONS = [
	{
		value: '_self',
		label: 'Stay in Window',
	},
	{
		value: '_blank',
		label: 'Open New Window',
	},
];

/**
 * Stateless component for links
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const LinkFieldset = (props) => {
	// styles
	const targetClasses = classNames({
		[styles.inputGeneric]: true,
		'pllink-target': true,
	});
	const urlClasses = classNames({
		[styles.inputGeneric]: true,
		'pllink-url': true,
	});
	const labelClasses = classNames({
		[styles.inputGeneric]: true,
		'pllink-label': true,
	});
	const legendClasses = classNames({
		[styles.label]: true,
		'legend-label': true,
	});

	return (
		<fieldset className={styles.fieldset}>
			<legend className={legendClasses}>{props.label}</legend>
			<div className={urlClasses}>
				<input
					type="text"
					name="url"
					value={props.valueUrl}
					placeholder="URL"
					onChange={props.handleURLChange}
				/>
			</div>
			<div className={labelClasses}>
				<input
					type="text"
					name="label"
					value={props.valueLabel}
					placeholder="Label"
					onChange={props.handleLabelChange}
				/>
			</div>
			<div className={targetClasses}>
				<ReactSelect
					name="target"
					value={props.valueTarget}
					options={TARGET_OPTIONS}
					clearable={false}
					onChange={props.handleTargetChange}
				/>
			</div>
			<p className={styles.description}>{props.description}</p>
		</fieldset>
	);
};

LinkFieldset.propTypes = {
	label: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.array,
	handleURLChange: PropTypes.func,
	handleLabelChange: PropTypes.func,
	handleTargetChange: PropTypes.func,
	valueUrl: PropTypes.string,
	valueLabel: PropTypes.string,
	valueTarget: PropTypes.string,
};

LinkFieldset.defaultProps = {
	label: '',
	description: '',
	valueUrl: '',
	valueLabel: '',
	valueTarget: '',
	handleURLChange: () => { },
	handleLabelChange: () => { },
	handleTargetChange: () => { },
	strings: [],
};

export default LinkFieldset;
