import React, { Component } from 'react';

import styles from './text.pcss';

class Text extends Component {
	constructor (props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange() {
		//code to connect to actions that execute on redux store
	}

	render() {
		return (
			<div className={ styles.panelInput }>
				<label className={ styles.panelInputLabel }>{this.props.label}</label>
				<span className={ styles.panelInputField }>
					<input type="text" name={this.props.name} value="" size="40" onChange={this.handleChange} />
				</span>
				<p className={ styles.panelInputDescription }>{this.props.description}</p>
			</div>
		);
	}
}

Text.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.array,
	default: React.PropTypes.string,
};

Text.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
};

export default Text;
