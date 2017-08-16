import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import request from 'superagent';
import param from 'jquery-param';

import PostPreview from './post-preview';
import * as AdminCache from '../../util/data/admin-cache';
import { getThumbnailPath } from '../../util/media';

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

	componentWillMount() {
		this.assessHowToBuildPreview();
	}

	componentWillReceiveProps(nextProps) {
		const didPostIdChange = nextProps.post_id !== this.state.post_id && nextProps.post_id != null;
		const didPostChange = nextProps.post != null && !_.isMatch(nextProps.post, this.state.post);
		if (didPostIdChange) {
			this.setState({
				post_id: nextProps.post_id,
				postThumbnailHtml: '',
				post: null,
			}, this.assessHowToBuildPreview);
		} else if (didPostChange) {
			this.setState({
				post: nextProps.post,
				postThumbnailHtml: '',
			}, this.assessHowToBuildPreview);
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
	 * Assess how to handle prop change
	 *
	 * @method assessHowToBuildPreview
	 */
	assessHowToBuildPreview() {
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

	/**
	 * Handles display of thumbnail. Uses either the post thumbnail_html
	 * or gets it from getThumbnailPath (either cache or wp.media)
	 *
	 * @method getThumbnailHTMLFromImage
	 */
	assignPostThumbnail() {
		let postThumbnailHtml = '';
		if (this.state.post) {
			if (this.state.post.thumbnail_html) {
				// display post thumbnail html
				postThumbnailHtml = this.state.post.thumbnail_html;
				this.setState({
					postThumbnailHtml,
				});
			} else if (this.state.post.thumbnail_id) {
				// retrieve from either image cache or wp media
				getThumbnailPath(parseInt(this.state.post.thumbnail_id, 10), (imageURL) => {
					postThumbnailHtml = this.getThumbnailHTMLFromImage(imageURL);
					this.setState({
						postThumbnailHtml,
					});
				});
			}
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
			const filters = {
				post_type: {
					selection: [this.props.post_type],
					lock: true,
				},
			};
			filters.panel_type = this.props.panelType;
			const params = param({
				action: 'posts-field-fetch-preview',
				filters,
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
						url={this.state.post.url}
						onRemoveClick={removeHandler}
						onEditClick={editHandler}
					/>
				}
			</div>
		);
	}
}

PostPreviewContainer.propTypes = {
	editableId: PropTypes.string,
	onEditClick: PropTypes.func,
	onGetPostDetails: PropTypes.func,
	onRemoveClick: PropTypes.func,
	panelType: PropTypes.string,
	post: PropTypes.object,
	post_id: PropTypes.string,
	post_type: PropTypes.string,
	thumbnailId: PropTypes.number,
};

PostPreviewContainer.defaultProps = {
	editableId: '',
	onEditClick: null,
	onGetPostDetails: null,
	onRemoveClick: null,
	panelType: '',
	post: null,
	post_id: null,
	post_type: '',
	thumbnailId: null,
};

export default PostPreviewContainer;
