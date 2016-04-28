import React, { Component } from 'react';

class Text extends Component {
	render() {
		return (
			<div className='panel-field'>
				<h3>{this.props.title}</h3>
				<span className='panel-input-field'><input type='text' name={this.props.name} value={this.props.value}
				                                           size='40'/></span>
			</div>
		);
	}
}

Text.propTypes = {
	name: React.PropTypes.string,
	value: React.PropTypes.string,
	title: React.PropTypes.string
};

Text.defaultProps = {
	name: 'title',
	value: '',
	title: ''
};

export default Text;
