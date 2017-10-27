import ReactSelect from 'react-select-plus';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';

class PostTypeSelect extends Component {
	constructor(props) {
		super(props);
		this.maybePreselectPostTypes();
	}

	// if only one possible post type is returned, then pre-select it
	maybePreselectPostTypes() {
		if (this.props.postTypes.length === 1 && this.props.value.length === 0) {
			this.props.onChange(this.props.postTypes[0]); // pass state back up chain
		}
	}

	render() {
		return (
			<ReactSelect
				options={this.props.postTypes}
				name={this.props.name}
				placeholder={this.props.placeHolder}
				multi={this.props.multi}
				value={this.props.value}
				searchable={this.props.searchable}
				onChange={this.props.onChange}
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
	onChange: React.PropTypes.func,
};

PostTypeSelect.defaultProps = {
	postTypes: [],
	name: _.uniqueId('post-list-type-'),
	multi: false,
	value: [],
	searchable: false,
	placeHolder: 'Select Post Types',
	onChange: () => {},
};

export default PostTypeSelect;
