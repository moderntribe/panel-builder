import ReactSelect from 'react-select-plus';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';

class PostTypeSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			postTypes: this.maybePreselectPostTypes(),
		};
	}

	// if only one possible post type is returned, then pre-select it
	maybePreselectPostTypes() {
		let postTypes = [];
		console.log(this.props.postTypes);
		console.log(this.props.value);

		// if only one possible post type is returned, then pre-select it
		if (this.props.postTypes.length === 1 && this.props.value.length === 0) {
			postTypes = this.props.postTypes[0].value;
		} else {
			postTypes = this.props.value;
		}

		return postTypes;
	}

	render() {
		return (
			<ReactSelect
				options={this.props.postTypes}
				name={this.props.name}
				placeholder={this.props.placeHolder}
				multi={this.props.multi}
				value={this.state.postTypes}
				searchable={this.props.searchable}
				onChange={this.props.handlePostTypeChange}
			/>
		);
	}
}

PostTypeSelect.propTypes = {
	postTypes: PropTypes.array,
	name: PropTypes.string,
	placeHolder: PropTypes.string,
	multi: PropTypes.bool,
	value: PropTypes.array,
	searchable: PropTypes.bool,
	handlePostTypeChange: React.PropTypes.func,
};

PostTypeSelect.defaultProps = {
	postTypes: [],
	name: _.uniqueId('post-list-type-'),
	multi: false,
	value: [],
	searchable: false,
	placeHolder: 'Select Post Types',
	handlePostTypeChange: () => {},
};

export default PostTypeSelect;
