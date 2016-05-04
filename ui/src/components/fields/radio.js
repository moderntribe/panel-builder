import React, { Component } from 'react';

import styles from './radio.pcss';

class Radio extends Component {
	constructor (props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		//code to connect to actions that execute on redux store, sending along e.currentTarget.value
	}

	render() {
		const Options = _.map(this.props.options, (option, i) =>
			<label
				className={ styles.panelRadioOption }
				key={_.uniqueId('option-id-')}
			>
				<input
					type="radio"
					name={this.props.name}
					value={option.value}
					onChange={this.handleChange}
					checked={this.props.default === option.value}
					/>
				{option.label}
			</label>
		);

		return (
			<div className={ styles.panelRadio }>
				<label className={ styles.panelRadioLabel }>{this.props.label}</label>
				{Options}
				<p className={ styles.panelRadioDescription }>{this.props.description}</p>
			</div>
		);
	}
}

Radio.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.array,
	default: React.PropTypes.string,
	options: React.PropTypes.array,
};

Radio.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
	options: [],
};

export default Radio;
