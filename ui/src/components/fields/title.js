import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import styles from './title.pcss';

class Title extends Component {
	state = {
		text: this.props.data.length ? this.props.data : this.props.default,
	};

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
			'panel-input-label-title': true,
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
					<input type="text" name={this.props.name} value={this.state.text} onChange={this.handleChange} />
				</span>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Title.propTypes = {
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.array,
	default: PropTypes.string,
	updatePanelData: PropTypes.func,
};

Title.defaultProps = {
	data: '',
	panelIndex: 0,
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
	updatePanelData: () => {},
};

export default Title;
