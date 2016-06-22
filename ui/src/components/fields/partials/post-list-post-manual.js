import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

import { wpMedia } from '../../../globals/wp';

import MediaUploader from '../../shared/media-uploader';
import Button from '../../shared/button';

import styles from './post-list-post-manual.pcss';
import * as AdminCache from '../../../util/data/admin-cache';

class PostListPostManual extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageId: this.props.imageId,
			postTitle: this.props.postTitle,
			postContent: this.props.postContent,
			postUrl: this.props.postUrl,
			editableId: this.props.editableId,
			method: 'manual',
		};
	}

	/**
	 * Handles the media uploader open click. Will be hooked up to redux soon.
	 *
	 * @method handleAddMedia
	 */
	@autobind
	handleAddMedia() {
		const frame = wpMedia({
			multiple: false,
			library: {
				type: 'image',
			},
		});

		frame.on('open', () => {
		});

		frame.on('select', () => {
			const attachment = frame.state().get('selection').first().toJSON();
			AdminCache.addImage(attachment);
			this.setState({ imageId: attachment.id });
		});

		frame.open();
	}

	/**
	 * Handles the removal of an image from state/store. Will be hooked up to redux soon.
	 *
	 * @method handleRemoveMedia
	 */
	@autobind
	handleRemoveMedia() {
		this.setState({ imageId: null });
	}

	@autobind
	handleAddToPanelClick(e) {
		e.preventDefault();
		this.props.handleAddClick({
			state: this.state,
		});
	}

	@autobind
	handleCancelClick(e) {
		e.preventDefault();
		this.props.handleCancelClick({
			state: this.state,
		});
	}

	@autobind
	handleTitleChange(e) {
		this.setState({
			postTitle: e.currentTarget.value,
		});
	}

	@autobind
	handleContentChange(e) {
		this.setState({
			postContent: e.currentTarget.value,
		});
	}

	@autobind
	handleUrlChange(e) {
		this.setState({
			postUrl: e.currentTarget.value,
		});
	}

	render() {
		const titleClasses = classNames({
			[styles.postTitle]: true,
		});

		const contentClasses = classNames({
			[styles.postContent]: true,
		});

		const urlClasses = classNames({
			[styles.url]: true,
		});

		// get image from image cache
		let imgPath = '';
		if(this.state.imageId) {
			const image = AdminCache.getImageById(this.state.imageId);
			if(image) {
				const firstSize = _.values(image.sizes)[0];
				imgPath = firstSize.url;
			}
		}

		return (
			<article className={styles.wrapper}>
				<input
					type="text"
					className={titleClasses}
					onChange={this.handleTitleChange}
					name="post_title"
					value={this.state.postTitle}
					placeholder={this.props.strings['label.title']}
				/>
				<textarea
					className={contentClasses}
					onChange={this.handleContentChange}
					name="post_content"
					value={this.state.postContent}
					placeholder={this.props.strings['label.content']}
				/>
				<input
					type="url"
					className={urlClasses}
					onChange={this.handleUrlChange}
					name="url"
					value={this.state.postUrl}
					placeholder={this.props.strings['label.link']}
				/>
				<MediaUploader
					label={this.props.label}
					size="large"
					file={imgPath}
					strings={this.props.strings}
					handleAddMedia={this.handleAddMedia}
					handleRemoveMedia={this.handleRemoveMedia}
				/>
				<footer className={styles.footer}>
					<Button
						text="Add to Panel"
						primary={false}
						full={false}
						handleClick={this.handleAddToPanelClick}
					/>
					<Button
						text="Cancel"
						handleClick={this.handleCancelClick}
						full={false}
						bare
					/>
				</footer>
			</article>
		);
	}
}


PostListPostManual.propTypes = {
	imageId: PropTypes.number,
	postTitle: PropTypes.string,
	postContent: PropTypes.string,
	postUrl: PropTypes.string,
	label: PropTypes.string,
	strings: PropTypes.object,
	editableId: PropTypes.string,
	handleCancelClick: PropTypes.func,
	handleAddClick: PropTypes.func,
};

PostListPostManual.defaultProps = {
	imageId: null,
	postTitle: '',
	postContent: '',
	postUrl: '',
	label: '',
	editableId: '',
	handleCancelClick: () => {},
	handleAddClick: () => {},
};

export default PostListPostManual;
