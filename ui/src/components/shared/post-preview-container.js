import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import request from 'superagent';
import param from 'jquery-param';
import _ from 'lodash';

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
			const post = AdminCache.getPostById(parseInt(this.state.post_id, 10));
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
	 * Retrieve thumbnail html from image
	 * Grabs the first thumbnail size
	 * TODO if thumbnails can be any dimension we may need this to set as part of blueprint
	 *
	 * @method getThumbnailHTMLFromImage
	 */
	getThumbnailHTMLFromImage(image) {
		const firstSize = _.values(image.sizes)[0];
		const imgPath = firstSize.url;
		const html = `<img src="${imgPath}" />`;
		return html
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
				}, () => {
					if (this.props.onGetPostDetails) {
						this.props.onGetPostDetails({
							state: this.state,
							editableId: this.state.editableId,
						});
					}
				});
			}
		}
	}

	@autobind
	handleRemovePreview() {
		// editableId
		this.props.onRemoveClick({
			state: this.state,
			editableId: this.state.editableId,
		});
	}

	@autobind
	handleEditPreview() {
		// editableId
		this.props.onEditClick({
			state: this.state,
			editableId: this.state.editableId,
		});
	}

	render() {
		// account for no remove button
		const removeHandler = this.props.onRemoveClick ? this.handleRemovePreview : null;
		const editHandler = this.props.onEditClick ? this.handleEditPreview : null;

		// get thumbnail html either as direct thumbnail_html or from the ID and fake it
		let thumbnailHTML='';
		if (this.state.post) {
			if (this.state.post.thumbnail_html){
				thumbnailHTML = this.state.post.thumbnail_html;
			} else if (this.state.post.thumbnail_id) {
				const image = AdminCache.getImageById(parseInt(this.state.post.thumbnail_id));
				if (image) {
					thumbnailHTML = this.getThumbnailHTMLFromImage(image);
				}
			}
		}

		return (
			<div>
				{this.state.loading && <div>Loading...</div>}
				{this.state.post &&
					<PostPreview
						title={this.state.post.post_title} excerpt={this.state.post.post_excerpt}
						thumbnail={thumbnailHTML} onRemoveClick={removeHandler}
						onEditClick={editHandler}
					/>
				}
			</div>
		);
	}
}

PostPreviewContainer.propTypes = {
	post: PropTypes.object,
	post_id: React.PropTypes.string,
	thumbnailId: React.PropTypes.number,
	onRemoveClick: React.PropTypes.func,
	onEditClick: React.PropTypes.func,
	editableId: React.PropTypes.string,
	onGetPostDetails: React.PropTypes.func,
};

PostPreviewContainer.defaultProps = {
	post: null,
	post_id: null,
	thumbnailId: null,
	onRemoveClick: null,
	onEditClick: null,
	onGetPostDetails: null,
	editableId: '',
};

export default PostPreviewContainer;
