import React, { Component } from 'react';

class Select extends Component {
	render() {

		const options = _.map(this.props.options, (option, i) => {
			return <option value={option.value} key={`option-${i}`}>{option.label}</option>;
		});

		return (
			<div className='panel-field'>
				<h3>{this.props.title}</h3>
				<select className='panel-input-field' name={this.props.name}>{options}</select>
			</div>
		);
	}
}

Select.propTypes = {
	options: React.PropTypes.array,
	name: React.PropTypes.string,
	title: React.PropTypes.string
};

Select.defaultProps = {
	options: [],
	name: '',
	title: ''
};

export default Select;
