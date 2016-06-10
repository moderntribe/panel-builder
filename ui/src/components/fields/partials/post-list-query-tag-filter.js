import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';

import styles from './post-list-query-tag-filter.pcss';

class PostListQueryTagFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tag: '',
		};
	}

	render() {
		return (
			<div className={styles.filter}>
				<label className={styles.label}>Tags</label>
				<span className={styles.inputContainer}>
					<input value={this.props.tag} onChange={this.props.onChangeTag} />
				</span>
			</div>
		);
	}
}

PostListQueryTagFilter.propTypes = {
	onRemoveClick: React.PropTypes.func,
	onChangeTag: React.PropTypes.func,
};

PostListQueryTagFilter.defaultProps = {
	onRemoveClick: () => {},
	onChangeTag: () => {},
};

export default PostListQueryTagFilter;
