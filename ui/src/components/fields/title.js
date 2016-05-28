import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';

import styles from './title.pcss';

class Title extends Component {
	@autobind
	handleChange() {
		// code to connect to actions that execute on redux store
	}

	render() {
		return (
			<div className={styles.field}>
				<label className={styles.label}>{this.props.label}</label>
				<span className={styles.inputContainer}>
					<input type="text" name={this.props.name} value="" size="40" onChange={this.handleChange} />
				</span>
				<p className={styles.description}>{this.props.description}</p>
			</div>
		);
	}
}

Title.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.array,
	default: PropTypes.string,
};

Title.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
};

export default Title;
