import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

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

ColumnWidth.propTypes = {
	data: React.PropTypes.string,
	default: React.PropTypes.string,
	depth: React.PropTypes.number,
	description: React.PropTypes.string,
	indexMap: React.PropTypes.array,
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	options: React.PropTypes.array,
	panelIndex: React.PropTypes.number,
	strings: React.PropTypes.object,
	updatePanelData: React.PropTypes.func,
};

ColumnWidth.defaultProps = {
	data: '',
	default: '',
	depth: 0,
	description: '',
	indexMap: [],
	label: '',
	name: '',
	options: [],
	panelIndex: 0,
	strings: {},
	updatePanelData: () => {},
};

export default ColumnWidth;
