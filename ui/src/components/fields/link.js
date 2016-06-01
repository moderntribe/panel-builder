import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import LinkGroup from '../shared/link-group';

import classNames from 'classnames';

import styles from './link.pcss';

class Link extends Component {
	state = {
		url: this.props.default.url,
		label: this.props.default.label,
		target: (this.props.default && this.props.default.target) ? this.props.default.target : '_self',
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
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
		});
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});

		return (
			<div className={fieldClasses}>
				<fieldset className={styles.fieldset}>
					<legend className={labelClasses}>{this.props.label}</legend>
					<LinkGroup handleTargetChange={this.handleSelectChange} handleLabelChange={this.handleTextChange} handleURLChange={this.handleTextChange} valueTarget={this.state.target} valueUrl={this.state.url} valueLabel={this.state.label} />
					<p className={descriptionClasses}>{this.props.description}</p>
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
