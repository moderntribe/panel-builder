import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './select.pcss';

class Select extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange() {
		// code to connect to actions that execute on redux store, sending along e.currentTarget.value
	}

	render() {
		const Options = _.map(this.props.options, (option) =>
			<option value={option.value}>{option.label}</option>
		);
		return (
			<div className={styles.panel}>
				<label className={styles.label}>{this.props.label}</label>
				<select value={this.props.default} name={this.props.name}>
					{Options}
				</select>
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
