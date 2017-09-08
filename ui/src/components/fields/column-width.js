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
			depth: this.props.depth,
			index: this.props.panelIndex,
			name: this.props.name,
			value,
		});
	}

	render() {
		const imgSelectLabelClasses = classNames({
			'plcolumnwidth-label': true,
			[styles.columnWidthLabel]: true,
		});

		const Options = _.map(this.props.options, option =>
			<label
				className={imgSelectLabelClasses}
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
				{option.label}
			</label>,
		);

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
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.object,
	depth: React.PropTypes.number,
	default: React.PropTypes.string,
	options: React.PropTypes.array,
	data: React.PropTypes.string,
	panelIndex: React.PropTypes.number,
	updatePanelData: React.PropTypes.func,
};

ColumnWidth.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: {},
	depth: 0,
	default: '',
	options: [],
	data: '',
	panelIndex: 0,
	updatePanelData: () => {},
};

export default ColumnWidth;
