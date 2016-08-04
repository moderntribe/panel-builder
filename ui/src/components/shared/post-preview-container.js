import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import request from 'superagent';
import param from 'jquery-param';
import _ from 'lodash';

import PostPreview from './post-preview';
import * as AdminCache from '../../util/data/admin-cache';
import { wpMedia } from '../../globals/wp';

class PostPreviewContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			post: this.props.post,
			post_id: this.props.post_id,
			editableId: this.props.editableId,
			postThumbnailHtml: '',
		};
	}

	assignPostThumbnail() {
		let postThumbnailHtml = '';
		if (this.state.post) {
			if (this.state.post.thumbnail_html) {
				console.log("this.state.post.thumbnail_html",this.state.post.thumbnail_html)
				postThumbnailHtml = this.state.post.thumbnail_html;
				this.setState({
					postThumbnailHtml,
				})
			} else if (this.state.post.thumbnail_id) {
				const image = AdminCache.getImageById(parseInt(this.state.post.thumbnail_id, 10));
				console.log("image",image)
				if (image) {
					postThumbnailHtml = this.getThumbnailHTMLFromImage(image.thumbnail);
					this.setState({
						postThumbnailHtml,
					})
				} else {
					// get image path from id
					const attachment = wpMedia.attachment(parseInt(this.state.post.thumbnail_id, 10));
					console.log("attachment",attachment)
					attachment.fetch({
						success: (att) => {
							if (att.attributes && att.attributes.type == 'image') {
								const imageUrl = AdminCache.cacheSrcByAttachment(att.attributes);
								console.log("imageUrl",imageUrl)
								postThumbnailHtml = this.getThumbnailHTMLFromImage(imageUrl);
								this.setState({
									postThumbnailHtml,
								})
							}
						}
					});
				}
			}
		}
	}

	componentWillMount() {
		if (this.state.post) {
			this.setState({
				loading: false,
			}, this.assignPostThumbnail);
		} else if (this.state.post_id) {
			const post = AdminCache.getPostById(parseInt(this.state.post_id, 10));
			if (post) {
				this.setState({
					post,
					loading: false,
				}, this.assignPostThumbnail);
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
	 * Assumes all images have a thumbnail size
	 *
	 * @method getThumbnailHTMLFromImage
	 */
	getThumbnailHTMLFromImage(imgPath) {
		const html = `<img src="${imgPath}" />`;
		return html;
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
				this.assignPostThumbnail();
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
		return (
			<div>
			{this.state.loading && <div>Loading...</div>}
		{this.state.post &&
		<PostPreview
			title={this.state.post.post_title}
			excerpt={this.state.post.post_excerpt}
			thumbnail={this.state.postThumbnailHtml}
			onRemoveClick={removeHandler}
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
