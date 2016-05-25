import React, { Component } from 'react';
import ReactSelect from 'react-select';
import styles from './select.pcss';

class Select extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			value: this.props.default,
		};
	}

	handleChange(data) {
		// code to connect to actions that execute on redux store, sending along e.currentTarget.value
		const value = data ? data.value : this.props.default;
		this.setState({ value });
	}

	render() {
		return (
			<div className={styles.panel}>
				<label className={styles.label}>{this.props.label}</label>
				<ReactSelect
					name={this.props.name}
					value={this.state.value}
					options={this.props.options}
					onChange={this.handleChange}
				/>
				<p className={styles.description}>{this.props.description}</p>
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
