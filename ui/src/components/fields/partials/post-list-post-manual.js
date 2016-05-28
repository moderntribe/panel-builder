import React, { PropTypes, Component } from 'react';
import { sortable } from 'react-anything-sortable';

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
