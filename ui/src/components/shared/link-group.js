import React, { PropTypes } from 'react';
import ReactSelect from 'react-select-plus';
import classNames from 'classnames';
import styles from './link-group.pcss';

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

const LinkGroup = (props) => {
	// styles
	const targetClasses = classNames({
		[styles.inputGeneric]: true,
		'panel-group-link-target': true,
	});
	const urlClasses = classNames({
		[styles.inputGeneric]: true,
		'panel-group-url': true,
	});
	const labelClasses = classNames({
		[styles.inputGeneric]: true,
		'panel-group-label': true,
	});

	return (
		<div>
			<div className={urlClasses}>
				<input
					type="url"
					name="url"
					value={props.valueUrl}
					placeholder={props.strings['placeholder.url']}
					aria-label={props.strings['placeholder.url']}
					onChange={props.handleURLChange}
				/>
			</div>
			<div className={labelClasses}>
				<input
					type="text"
					name="label"
					value={props.valueLabel}
					placeholder={props.strings['placeholder.label']}
					aria-label={props.strings['placeholder.label']}
					onChange={props.handleLabelChange}
				/>
			</div>
			<div className={labelClasses}>
				<input
					type="text"
					name="arialabel"
					value={props.valueARIALabel}
					placeholder={props.strings['placeholder.arialabel']}
					aria-label={props.strings['placeholder.arialabel']}
					onChange={props.handleARIALabelChange}
				/>
			</div>
			<div className={targetClasses}>
				<ReactSelect
					name="target"
					value={props.valueTarget}
					aria-label={props.strings['placeholder.target']}
					searchable={false}
					clearable={false}
					options={TARGET_OPTIONS}
					onChange={props.handleTargetChange}
				/>
			</div>
		</div>
	);
};

LinkGroup.propTypes = {
	strings: PropTypes.object,
	handleURLChange: PropTypes.func,
	handleLabelChange: PropTypes.func,
	handleARIALabelChange: PropTypes.func,
	handleTargetChange: PropTypes.func,
	valueUrl: PropTypes.string,
	valueLabel: PropTypes.string,
	valueARIALabel: PropTypes.string,
	valueTarget: PropTypes.string,
};

LinkGroup.defaultProps = {
	valueUrl: '',
	valueLabel: '',
	valueARIALabel: '',
	valueTarget: '',
	handleURLChange: () => { },
	handleLabelChange: () => { },
	handleARIALabelChange: () => { },
	handleTargetChange: () => { },
	strings: {},
};

export default LinkGroup;
