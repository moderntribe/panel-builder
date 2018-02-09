import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import * as styleUtil from '../../util/dom/styles';
import styles from './toggle.pcss';

class Toggle extends Component {
	state = {
		value: this.props.data,
	};

	@autobind
	handleChange(e) {
		const value = parseInt(e.currentTarget.value, 10) === 0 ? 1 : 0;
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value,
		});
	}

	renderOptions() {
		const toggleLabelClasses = classNames({
			'modular-content-toggle-label': false,
			'toggle': true,
			[styles.toggleLabel]: true,
		});

		const sliderClasses = classNames({
			[styles.toggleSlider]: true,
		});

		return (
			<label
				className={toggleLabelClasses}
			>
				<input
					type="checkbox"
					value={this.state.value}
					tabIndex={0}
					name={`modular-content-${this.props.name}`}
					className={styles.toggleInput}
					onChange={this.handleChange}
					checked={this.state.value === 1}
				/>
				<div
					className={sliderClasses}
				/>
				<span />
			</label>
		);
	}

	render() {
		const { descriptionClasses, labelClasses } = styleUtil.defaultFieldClasses(styles);

		const fieldClasses = classNames({
			[styles.field]: true,
			[styles.simple]: !this.props.stylized,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<div className={styles.container}>
					{this.renderOptions()}
				</div>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Toggle.propTypes = {
	data: PropTypes.number,
	default: PropTypes.number,
	depth: PropTypes.number,
	description: PropTypes.string,
	indexMap: PropTypes.array,
	label: PropTypes.string,
	name: PropTypes.string,
	options: PropTypes.array,
	stylized: PropTypes.bool,
	updatePanelData: PropTypes.func,
};

Toggle.defaultProps = {
	data: 0,
	default: 0,
	depth: 0,
	description: '',
	indexMap: [],
	label: '',
	name: '',
	options: [],
	stylized: true,
	updatePanelData: () => {},
};

export default Toggle;
