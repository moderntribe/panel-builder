import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';
import classNames from 'classnames';
import styles from './select.pcss';

class Select extends Component {
	state = {
		value: this.props.default,
	};
	@autobind
	handleChange(data) {
		// code to connect to actions that execute on redux store, sending along e.currentTarget.value
		const value = data ? data.value : this.props.default;
		this.setState({ value });
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
		});
		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<ReactSelect
					name={this.props.name}
					value={this.state.value}
					options={this.props.options}
					onChange={this.handleChange}
				/>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Select.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.array,
	default: React.PropTypes.string,
	options: React.PropTypes.array,
};

Select.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
	options: [],
};

export default Select;
