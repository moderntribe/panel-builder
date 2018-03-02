import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toggleCustomInlineStyle } from 'draftjs-utils';

class AllCaps extends Component {
	toggleCaps = () => {
		const { editorState, onChange } = this.props;
		const newState = toggleCustomInlineStyle(
			editorState,
			'textTransform',
			'uppercase',
		);
		if (newState) {
			onChange(newState);
		}
	};

	render() {
		return (
			<div className="rdw-storybook-custom-option" onClick={this.toggleCaps} />
		);
	}
}

AllCaps.propTypes = {
	editorState: PropTypes.object,
	onChange: PropTypes.func,
};

AllCaps.defaultProps = {
	editorState: {},
	onChange: () => {},
};

export default AllCaps;
