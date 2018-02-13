import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

import LabelTooltip from './partials/label-tooltip';
import styles from './column-width.pcss';

class ColumnWidth extends Component {
	state = {
		value: this.props.data,
	};

	@autobind
	handleChange(e) {
		const value = e.currentTarget.value;
		this.setState({ value });
		this.props.updatePanelData({
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
			name: this.props.name,
			value,
		});
	}

	render() {
		const width = 100 / this.props.options.length;
		const Options = this.props.options.map((option, i) => {
			const columnWidthLabelClasses = classNames({
				'plcolumnwidth-label': true,
				[styles.columnWidthLabel]: true,
				[styles.active]: (i + 1) <= this.state.value,
			});
			const labelStyle = {
				width: `${width}%`,
			};
			return (
				<label
					className={columnWidthLabelClasses}
					style={labelStyle}
					key={_.uniqueId('option-img-sel-id-')}
				>
					<input
						type="radio"
						name={`modular-content-${this.props.name}`}
						value={option.value}
						onChange={this.handleChange}
						checked={this.state.value === option.value}
						data-option-type="single"
						data-field="column-width"
					/>
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

ColumnWidth.propTypes = {
	data: PropTypes.number,
	default: PropTypes.number,
	depth: PropTypes.number,
	description: PropTypes.string,
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	label: PropTypes.string,
	name: PropTypes.string,
	options: PropTypes.array,
	panelIndex: PropTypes.number,
	strings: PropTypes.object,
	updatePanelData: PropTypes.func,
};

ColumnWidth.defaultProps = {
	data: 0,
	default: 0,
	depth: 0,
	description: '',
	indexMap: [],
	parentMap: [],
	label: '',
	name: '',
	options: [],
	panelIndex: 0,
	strings: {},
	updatePanelData: () => {},
};

export default ColumnWidth;
