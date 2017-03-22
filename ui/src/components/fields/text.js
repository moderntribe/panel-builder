import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import styles from './text.pcss';

class Text extends Component {

	state = {
		text: this.props.data,
	};

	/**
	 * Handler for changes to the text field. Initiates panel update call.
	 *
	 * @method handleChange
	 */
	@autobind
	handleChange(e) {
		const text = e.currentTarget.value;
		this.setState({ text });
		this.props.updatePanelData({
			index: this.props.panelIndex,
			name: this.props.name,
			value: text,
		});
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
					<input type="text" name={`modular-content-${this.props.name}`} value={this.state.text} size="40" onChange={this.handleChange} />
				</span>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Text.propTypes = {
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.object,
	default: PropTypes.string,
	updatePanelData: PropTypes.func,
};

Text.defaultProps = {
	data: '',
	panelIndex: 0,
	label: '',
	name: '',
	description: '',
	strings: {},
	default: '',
	updatePanelData: () => {},
};

export default Text;
