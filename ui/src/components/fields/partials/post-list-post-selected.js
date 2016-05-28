import React, { PropTypes, Component } from 'react';
import { sortable } from 'react-anything-sortable';

import styles from './post-list-post-selected.pcss';

@sortable
class PostListPostSelected extends Component {
	render() {
		return (
			<div {...this.props}>
				selected
			</div>
		);
	}
}
