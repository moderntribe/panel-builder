import React, { Component, PropTypes } from 'react';
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

class LinkFieldset extends Component {

	render() {
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
				<legend className={legendClasses}>{this.props.label}</legend>
				<div className={urlClasses}>
					<input
						type="text"
						name="url"
						value={this.props.value_url}
						placeholder="URL"
						onChange={this.props.handleURLChange}
					/>
				</div>
				<div className={labelClasses}>
					<input
						type="text"
						name="label"
						value={this.props.value_label}
						placeholder="Label"
						onChange={this.props.handleLabelChange}
					/>
				</div>
				<div className={targetClasses}>
					<ReactSelect
						name="target"
						value={this.props.value_target}
						options={TARGET_OPTIONS}
						clearable={false}
						onChange={this.props.handleTargetChange}
					/>
				</div>
				<p className={styles.description}>{this.props.description}</p>
			</fieldset>
		);
	}
}

LinkFieldset.propTypes = {
	label: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.array,
	handleURLChange: PropTypes.func,
	handleLabelChange: PropTypes.func,
	handleTargetChange: PropTypes.func,
	default: React.PropTypes.object,
};

LinkFieldset.defaultProps = {
	label: '',
	description: '',
	handleURLChange: () => { },
	handleLabelChange: () => { },
	handleTargetChange: () => { },
	strings: [],
	default: {},
};

export default LinkFieldset;
