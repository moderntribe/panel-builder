import React, { Component } from 'react';

import styles from './text.pcss';

class Text extends Component {

	constructor (props) {
		super(props);
		this.state = {
			input_value: '',
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.setState({
			input_value: e.target.value
		})
		return true;
	}

	render() {
		// graeme you are going to want to use clasnames module and grab styles from the scss in the old assets folder. check the panel.pcss file.
		// className={styles.main}
		return (
			<div className={ styles.panelInput }>
				<label className={ styles.panelInputLabel }>{this.props.label}</label>
				<span className={ styles.panelInputField }>
					<input type="text" name={this.props.name} value="" size="40" value={this.state.input_value} onChange={this.handleChange} />
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
