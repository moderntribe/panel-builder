import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import { BlockPicker } from 'react-color';

import Button from '../shared/button';

import styles from './color-picker.pcss';

class ColorPicker extends Component {
	state = {
		pickerActive: false,
		value: this.props.data,
	};

	@autobind
	handleChange(e) {
		const value = e.hex;
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			index: this.props.panelIndex,
			name: this.props.name,
			value,
		});
	}

	@autobind
	handleToggle() {
		this.setState({ pickerActive: !this.state.pickerActive });
	}

	renderPicker() {
		return this.state.pickerActive ? (
			<BlockPicker
				color={this.state.value}
				colors={this.props.swatches}
				onChange={this.handleChange}
			/>
		) : null;
	}

	renderToggle() {
		const colorLabelClasses = classNames({
			'site-builder__color-field-label': true,
			[styles.colorLabel]: true,
			[styles.pickerActive]: this.state.pickerActive,
		});

		const pickerStyles = {
			backgroundColor: this.state.value,
		};

		const arrowClasses = classNames({
			'site-builder__color-arrow': true,
			[styles.selectedColorArrow]: true,
			'dashicons': true,
			'dashicons-arrow-down': !this.state.pickerActive,
			'dashicons-arrow-up': this.state.pickerActive,
		});

		return (
			<div
				className={colorLabelClasses}
			>
				<div
					className={styles.selectedColor}
					style={pickerStyles}
				>
					<i className={arrowClasses} />
					<Button
						classes={styles.colorTrigger}
						bare
						handleClick={this.handleToggle}
					/>
				</div>
				{this.renderPicker()}
			</div>
		);
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
			'panel-conditional-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<div className={styles.container}>
					{this.renderToggle()}
				</div>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

ColorPicker.propTypes = {
	data: React.PropTypes.string,
	default: React.PropTypes.string,
	depth: React.PropTypes.number,
	description: React.PropTypes.string,
	input_active: React.PropTypes.bool,
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	panelIndex: React.PropTypes.number,
	strings: React.PropTypes.object,
	swatches: React.PropTypes.array,
	updatePanelData: React.PropTypes.func,
};

ColorPicker.defaultProps = {
	data: '',
	default: '',
	depth: 0,
	description: '',
	input_active: false,
	label: '',
	name: '',
	panelIndex: 0,
	strings: {},
	swatches: [],
	updatePanelData: () => {},
};

export default ColorPicker;
