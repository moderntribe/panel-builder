import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';
import classNames from 'classnames';

import styles from './link.pcss';

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

class Link extends Component {
	state = {
		url: this.props.default.url,
		label: this.props.default.label,
		target: this.props.default.target.length ? this.props.default.target : '_self',
	};

	@autobind
	handleTextChange(event) {
		// code to connect to actions that execute on redux store
		this.setState({ [event.currentTarget.name]: event.currentTarget.value });
	}
	@autobind
	handleSelectChange(data) {
		// code to connect to actions that execute on redux store
		const target = data.value.length ? data.value : '_self';
		this.setState({ target });
	}

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
		const fieldLabelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const descriptionStyles = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});
		const fieldStyles = classNames({
			[styles.field]: true,
			'panel-field': true,
		});

		return (
			<div className={fieldStyles}>
				<fieldset className={styles.fieldset}>
					<legend className={fieldLabelClasses}>{this.props.label}</legend>
					<div className={urlClasses}>
						<input
							type="text"
							name="url"
							value={this.state.url}
							placeholder="URL"
							onChange={this.handleTextChange}
						/>
					</div>
					<div className={labelClasses}>
						<input
							type="text"
							name="label"
							value={this.state.label}
							placeholder="Label"
							onChange={this.handleTextChange}
						/>
					</div>
					<div className={targetClasses}>
						<ReactSelect
							name="target"
							value={this.state.target}
							options={TARGET_OPTIONS}
							clearable={false}
							onChange={this.handleSelectChange}
						/>
					</div>
					<p className={descriptionStyles}>{this.props.description}</p>
				</fieldset>
			</div>
		);
	}
}

Link.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.array,
	default: React.PropTypes.object,
};

Link.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: {},
};

export default Link;
