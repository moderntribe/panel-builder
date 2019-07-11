import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

import styles from './swatch-select.pcss';
import LabelTooltip from './partials/label-tooltip';

class SwatchSelect extends Component {
	state = {
		value: this.props.data,
	};

	@autobind
	handleChange(e) {
		const value = e.currentTarget.value;
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
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
						data-depth={this.props.depth}
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
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
			'panel-conditional-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>
				<div className={styles.container}>
					{Options}
				</div>
			</div>
		);
	}
}

SwatchSelect.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	depth: PropTypes.number,
	strings: PropTypes.object,
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	default: PropTypes.string,
	options: PropTypes.array,
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
};

SwatchSelect.defaultProps = {
	label: '',
	name: '',
	description: '',
	depth: 0,
	strings: {},
	indexMap: [],
	parentMap: [],
	default: '',
	options: [],
	data: '',
	panelIndex: 0,
	updatePanelData: () => {},
};

export default SwatchSelect;
