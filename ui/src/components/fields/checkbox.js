import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import classNames from 'classnames';

import styles from './checkbox.pcss';

class Checkbox extends Component {
	state = {
		data: this.props.data,
	};

	@autobind
	handleChange(e) {
		const key = e.currentTarget.value;
		const data = _.cloneDeep(this.state.data);
		data[key] = this.state.data[key] ? 0 : 1;
		this.setState({
			data,
		});
		this.props.updatePanelData({
			indexMap: this.props.indexMap,
			name: this.props.name,
			value: data,
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
			'panel-conditional-field': true,
		});
		const Options = _.map(this.props.options, option =>
			<li key={_.uniqueId('checkbox-id-')}>
				<label className={styles.checkboxLabel}>
					<input
						type="checkbox"
						name={`modular-content-${this.props.name}[]`}
						value={option.value}
						tabIndex={0}
						className={styles.checkbox}
						onChange={this.handleChange}
						checked={this.state.data && this.state.data[option.value]} // eslint-disable-line
						data-option-type="multiple"
						data-field="checkbox"
					/>
					<span />
					{option.label}
				</label>
			</li>,
		);

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<ul className={styles.list}>
					{Options}
				</ul>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Checkbox.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	depth: React.PropTypes.number,
	indexMap: React.PropTypes.array,
	description: React.PropTypes.string,
	strings: React.PropTypes.object,
	default: React.PropTypes.object,
	options: React.PropTypes.array,
	data: React.PropTypes.object,
	panelIndex: React.PropTypes.number,
	updatePanelData: React.PropTypes.func,
};

Checkbox.defaultProps = {
	label: '',
	name: '',
	description: '',
	indexMap: [],
	depth: 0,
	strings: {},
	default: {},
	options: [],
	data: {},
	panelIndex: 0,
	updatePanelData: () => {},
};

export default Checkbox;
