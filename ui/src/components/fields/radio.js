import React, { Component } from 'react';

import styles from './radio.pcss';

class Radio extends Component {


	constructor (props) {
		super(props);
		this.state = {
			current_value: this.props.default,
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.setState({
			current_value: e.target.value,
		});
		return true;
	}

	render() {

		const Options = _.map(this.props.options, (option) => {
			return <label className={ styles.panelRadioOption } key={_.uniqueId('option-id-')}><input type="radio" name={this.props.name} value={option.value} onChange={this.handleChange} checked={this.state.current_value === option.value}  />{option.label} </label>;
		});

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
