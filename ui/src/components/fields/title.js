import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';

import styles from './title.pcss';

class Title extends Component {
	state = {
		text: this.props.data.length ? this.props.data : this.props.default,
	};

	@autobind
	handleChange(e) {
		const text = e.currentTarget.value;
		this.setState({text});
	}

	render() {
		return (
			<div className={styles.field}>
				<label className={styles.label}>{this.props.label}</label>
				<span className={styles.inputContainer}>
					<input type="text" name={this.props.name} value={this.state.text} onChange={this.handleChange} />
				</span>
				<p className={styles.description}>{this.props.description}</p>
			</div>
		);
	}
}

Title.propTypes = {
	data: PropTypes.string,
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.array,
	default: PropTypes.string,
};

Title.defaultProps = {
	data: '',
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
};

export default Title;
