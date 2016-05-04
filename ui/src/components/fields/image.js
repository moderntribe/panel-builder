import React, { Component } from 'react';

class Image extends Component {
	componentDidMount() {

	}

	render() {
		return (
			null
		);
	}
}

Image.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.array,
	default: React.PropTypes.string,
	size: React.PropTypes.string,
};

Image.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
	size: 'thumbnail',
};

export default Image;
