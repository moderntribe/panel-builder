import React, { Component } from 'react';
import { sortable } from 'react-anything-sortable';

import MediaUploader from '../../shared/media-uploader';

import styles from './post-list-post-manual.pcss';

@sortable
class PostListPostManual extends Component {
	render() {
		return (
			<div {...this.props}>
				manual
			</div>
		);
	}
}

export default PostListPostManual;
