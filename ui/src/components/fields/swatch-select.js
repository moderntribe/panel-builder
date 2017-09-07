import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

import styles from './swatch-select.pcss';

class SwatchSelect extends Component {
	state = {
		value: this.props.data,
	};

	@autobind
	handleChange(e) {
		const value = e.currentTarget.value;
		this.setState({ value });
		this.props.updatePanelData({
			indexMap: this.props.indexMap,
			name: this.props.name,
			value,
		});
	}

	render() {
		const swatchSelectLabelClasses = classNames({
			'plswatchelect-label': true,
			[styles.islabel]: true,
		});

		const Options = _.map(this.props.options, (option, i) => {
			const optionStyle = {
				background: option.color,
			};

			return (
				<label
					className={swatchSelectLabelClasses}
					key={`swatch-select-${i}`}
				>
					<input
						type="radio"
						name={`modular-content-${this.props.name}`}
						value={option.value}
						onChange={this.handleChange}
						checked={this.state.value === option.value}
						data-option-type="single"
						data-field="swatch-select"
					/>
					<div
						className={styles.optionColor}
						style={optionStyle}
					>
						<span className={styles.optInner} />
					</div>
					{option.label && <span className={styles.optionLabel}>{option.label}</span>}
				</label>
			);
		});

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
					{Options}
				</div>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

SwatchSelect.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	depth: React.PropTypes.number,
	strings: React.PropTypes.object,
	indexMap: React.PropTypes.array,
	default: React.PropTypes.string,
	options: React.PropTypes.array,
	data: React.PropTypes.string,
	panelIndex: React.PropTypes.number,
	updatePanelData: React.PropTypes.func,
};

SwatchSelect.defaultProps = {
	label: '',
	name: '',
	description: '',
	depth: 0,
	strings: {},
	indexMap: [],
	default: '',
	options: [],
	data: '',
	panelIndex: 0,
	updatePanelData: () => {},
};

export default SwatchSelect;
