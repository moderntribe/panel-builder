import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import tinycolor from 'tinycolor2';
import classNames from 'classnames';

import Button from '../shared/button';

import * as domTools from '../../util/dom/tools';
import colorPickers from '../shared/color-picker-map';

import styles from './color-picker.pcss';
import * as styleUtil from '../../util/dom/styles';

/**
 * A Color Picker field
 *
 * Supports an array of set swatches in hex or rgba, arbitrary hex input or not and the ability to clear it or not by per field options.
 */

class ColorPicker extends Component {

	constructor(props) {
		super(props);
		this.state = {
			pickerActive: false,
			rgb: this.getInitialRGBValue(),
			value: this.props.data,
		};
		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
		document.addEventListener('click', this.onDocumentClick);
	}

	componentWillUnmount() {
		this.mounted = false;
		document.removeEventListener('click', this.onDocumentClick);
	}

	/**
	 * Hides the picker when a click outside the picker area is detected.
	 *
	 * @param event
	 */

	@autobind
	onDocumentClick(event) {
		if (!this.mounted) {
			return;
		}
		if (!this.state.pickerActive) {
			return;
		}
		if (domTools.closest(event.target, '[data-js="modular-content-color-picker"]')) {
			return;
		}
		this.setState({ pickerActive: false });
	}

	/**
	 * Returns the color the picker should spark up with. If the state is not set we look for default first, then the
	 * first of the swatches as a last resort.
	 *
	 * @returns {*}
	 */

	getActiveColor() {
		if (this.state.value.length) {
			return this.props.color_mode === 'rgb' ? this.state.rgb : this.state.value;
		}
		if (this.props.default.length) {
			return this.props.default;
		}

		return this.props.swatches[0];
	}

	/**
	 * We have to convert the css string value of rgba to the object react color uses on init if in rgb mode
	 *
	 * @returns {*}
	 */

	getInitialRGBValue() {
		if (this.props.color_mode !== 'rgb') {
			return {};
		}
		if (!this.props.data.length) {
			return {};
		}
		const rgbaArray = this.props.data.slice(0).replace(/[^0-9.,]/g, '').split(',');
		if (rgbaArray.length !== 4) {
			return {};
		}
		return {
			r: rgbaArray[0],
			g: rgbaArray[1],
			b: rgbaArray[2],
			a: rgbaArray[3],
		};
	}

	/**
	 * Fired when the picker changes value. Dispatches updates to the store.
	 *
	 * @param e
	 */

	@autobind
	handleChange(e) {
		let value = e && e[this.props.color_mode] ? e[this.props.color_mode] : '';
		if (this.props.color_mode === 'rgb' && e.rgb) {
			value = `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.rgb.a})`;
		}
		this.setState({
			pickerActive: value.length || _.isPlainObject(this.state.value) ? this.state.pickerActive : false,
			rgb: this.props.color_mode === 'rgb' && e.rgb ? e.rgb : {},
			value,
		});
		this.props.updatePanelData({
			depth: this.props.depth,
			index: this.props.panelIndex,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value,
		});
	}

	/**
	 * Hacks at the picker ui as it does not have props exposed. Currently modifies placeholder string with ours.
	 */

	updateUI() {
		if (!this.state.pickerActive) {
			return;
		}
		const input = this.el.querySelectorAll('.block-picker input')[0];
		if (!input) {
			return;
		}

		input.placeholder = this.props.strings['input.placeholder'];
	}

	/**
	 * Toggles the picker visibility, and then updates the ui.
	 */

	@autobind
	handleToggle() {
		this.setState({ pickerActive: !this.state.pickerActive }, () => this.updateUI());
	}

	/**
	 * Renders the picker if the state is active
	 *
	 * @returns {*}
	 */

	renderPicker() {
		const Picker = colorPickers[this.props.picker_type];
		return this.state.pickerActive ? (
			<Picker
				color={this.getActiveColor()}
				colors={this.props.swatches}
				presetColors={this.props.swatches}
				onChange={this.handleChange}
			/>
		) : null;
	}

	/**
	 * Renders the clear button if we allow it and the state has a value currently.
	 *
	 * @returns {*}
	 */

	renderClear() {
		return this.props.allow_clear && this.state.value.length ? (
			<Button
				classes={styles.colorClear}
				icon="dashicons-no-alt"
				bare
				handleClick={this.handleChange}
			/>
		) : null;
	}

	/**
	 * Renders the toggle that displays the current color and triggers the picker
	 *
	 * @returns {XML}
	 */

	renderToggle() {
		const colorLabelClasses = classNames({
			'site-builder__color-field-label': true,
			[styles.colorLabel]: true,
			[styles.pickerActive]: this.state.pickerActive,
			[styles.hasColor]: this.state.value.length,
			[styles.hasInput]: this.props.input_active,
			[styles.isLight]: this.state.value.length && tinycolor(this.state.value).isLight(),
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
					{this.renderClear()}
				</div>
				{this.renderPicker()}
			</div>
		);
	}

	render() {
		const { fieldClasses, descriptionClasses, labelClasses } = styleUtil.defaultFieldClasses(styles, this.props, true);

		return (
			<div ref={r => this.el = r} className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<div className={styles.container} data-js="modular-content-color-picker">
					{this.renderToggle()}
				</div>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

ColorPicker.propTypes = {
	allow_clear: PropTypes.bool,
	color_mode: PropTypes.string,
	data: PropTypes.string,
	default: PropTypes.string,
	depth: PropTypes.number,
	description: PropTypes.string,
	input_active: PropTypes.bool,
	indexMap: PropTypes.array,
	label: PropTypes.string,
	name: PropTypes.string,
	panelIndex: PropTypes.number,
	picker_type: PropTypes.string,
	strings: PropTypes.object,
	swatches: PropTypes.array,
	layout: PropTypes.string,
	updatePanelData: PropTypes.func,
};

ColorPicker.defaultProps = {
	allow_clear: false,
	color_mode: 'hex',
	data: '',
	default: '',
	depth: 0,
	description: '',
	input_active: false,
	indexMap: [],
	label: '',
	name: '',
	panelIndex: 0,
	picker_type: 'BlockPicker',
	strings: {},
	swatches: [],
	layout: '',
	updatePanelData: () => {},
};

export default ColorPicker;
