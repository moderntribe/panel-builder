import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import styles from './text.pcss';

class Text extends Component {
	@autobind
	handleChange() {
		// code to connect to actions that execute on redux store
	}

	render() {
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
		});
		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<span className={styles.inputContainer}>
					<input type="text" name={this.props.name} value="" size="40" onChange={this.handleChange} />
				</span>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Text.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.array,
	default: PropTypes.string,
};

Text.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
};

export default Text;
