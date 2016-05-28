import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import escape from 'escape-html';

import styles from './checkbox.pcss';

class Checkbox extends Component {
	@autobind
	handleChange() {
		// code to connect to actions that execute on redux store, sending along e.currentTarget.value
	}

	render() {
		const Options = _.map(this.props.options, (option) =>
			<li key={_.uniqueId('checkbox-id-')}>
				<label>
					<input
						type="checkbox"
						name={`${this.props.name}[${escape(option.value)}]`}
						value="1"
						className={styles.checkbox}
						onChange={this.handleChange}
						checked={this.props.default && this.props.default[option.value] === 1}
					/>
					{option.label}
				</label>
			</li>
		);

		return (
			<div className={styles.panel}>
				<label className={styles.label}>{this.props.label}</label>
				<ul className={styles.list}>
				{Options}
				</ul>
				<p className={styles.description}>{this.props.description}</p>
			</div>
		);
	}
}

Checkbox.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.array,
	default: React.PropTypes.object,
	options: React.PropTypes.array,
};

Checkbox.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: {},
	options: [],
};

export default Checkbox;
