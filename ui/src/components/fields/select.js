import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';
import classNames from 'classnames';
import styles from './select.pcss';

class Select extends Component {
	state = {
		value: this.props.data.length ? this.props.data : this.props.default,
	};
	@autobind
	handleChange(data) {
		// code to connect to actions that execute on redux store, sending along e.currentTarget.value
		const value = data ? data.value : this.props.default;
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			index: this.props.panelIndex,
			name: this.props.name,
			value,
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
		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<ReactSelect
					name={`modular-content-${this.props.name}`}
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
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	depth: React.PropTypes.number,
	strings: PropTypes.object,
	default: PropTypes.string,
	options: PropTypes.array,
	updatePanelData: PropTypes.func,
};

Select.defaultProps = {
	data: '',
	panelIndex: 0,
	label: '',
	name: '',
	description: '',
	depth: 0,
	strings: {},
	default: '',
	options: [],
	updatePanelData: () => {},
};

export default Select;
