import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import request from 'superagent';
import param from 'jquery-param';

import PostPreview from './post-preview';
import * as AdminCache from '../../util/data/admin-cache';

class PostPreviewContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			post: this.props.post,
			post_id: this.props.post_id,
			editableId: this.props.editableId,
		};
	}

	componentWillMount() {
		if (this.state.post) {
			this.setState({
				loading: false,
			});
		} else if (this.state.post_id) {
			const post = AdminCache.getPostById(this.state.post_id);
			console.log("cached post ",post );
			if (post) {
				this.setState({
					post,
					loading: false,
				});
			} else {
				this.updatePreview(this.state.post_id);
			}
		}
	}

	componentWillUnmount() {
		if (this.postRequest) {
			this.postRequest.abort();
		}
	}

	/**
	 * Called to update the preview after a use selects a new post
	 *
	 * @method updatePreview
	 */
	updatePreview(id) {
		if (!id) return;
		this.setState({
			loading: true,
		}, () => {
			const params = param({
				action: 'posts-field-fetch-preview',
				post_ids: [id],
			});
			this.postRequest = request
				.post(window.ajaxurl)
				.send(params)
				.end(this.handleUpdatePreview);
		});
	}

	/**
	 * Handler for after the preview is retrieved
	 *
	 * @method handleUpdatePreview
	 */
	@autobind
	handleUpdatePreview(err, response) {
		if (!err && response.ok) {
			const post = response.body.data.posts[response.body.data.post_ids[0]];
			if (post) {
				AdminCache.addPost(post);
				this.setState({
					post,
					loading: false,
				});
			}
		}
	}

	@autobind
	handleRemovePreview(e) {
		// editableId
		this.props.onRemoveClick({
			state:this.state,
		});
	}

	render() {
		// account for no remove button
		const removeHandler = this.props.onRemoveClick ? this.handleRemovePreview : null;
		return (
			<div>
				{this.state.loading && <div>Loading...</div>}
				{this.state.post && <PostPreview title={this.state.post.post_title} excerpt={this.state.post.post_excerpt} thumbnail={this.state.post.thumbnail_html} onRemoveClick={removeHandler} />}
			</div>
		);
	}
}

PostPreviewContainer.propTypes = {
	post: PropTypes.object,
	post_id: React.PropTypes.number,
	onRemoveClick: React.PropTypes.func,
	editableId: React.PropTypes.string,
};

PostPreviewContainer.defaultProps = {
	post: null,
	post_id: null,
	onRemoveClick: null,
	editableId: '',
};

export default PostPreviewContainer;
