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
			AdminCache.cacheSrcByAttachment(attachment);
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

	/**
	 * Handles add to the panel click
	 *
	 * @method handleAddToPanelClick
	 */
	@autobind
	handleAddToPanelClick(e) {
		e.preventDefault();
		this.props.handleAddClick({
			state: this.state,
		});
	}

	/**
	 * Handles cancel click
	 *
	 * @method handleCancelClick
	 */
	@autobind
	handleCancelClick(e) {
		e.preventDefault();
		this.props.handleCancelClick({
			state: this.state,
		});
	}

	/**
	 * Handles title change
	 *
	 * @method handleTitleChange
	 */
	@autobind
	handleTitleChange(e) {
		this.setState({
			postTitle: e.currentTarget.value,
		});
	}

	/**
	 * Handles content change
	 *
	 * @method handleContentChange
	 */
	@autobind
	handleContentChange(e) {
		this.setState({
			postContent: e.currentTarget.value,
		});
	}

	/**
	 * Handles url change
	 *
	 * @method handleUrlChange
	 */
	@autobind
	handleUrlChange(e) {
		this.setState({
			postUrl: e.currentTarget.value,
		});
	}

	/**
	 * Check if a field is supposed to be hidden
	 *
	 * @method isFieldHidden
	 */
	isFieldHidden(fieldName) {
		return _.indexOf(this.props.hiddenFields, fieldName) !== -1;
	}

	/**
	 * Checks if the post has what it needs to be added
	 *
	 * @method isAddBtnDisabled
	 */
	isAddBtnDisabled() {
		if (!this.isFieldHidden('post_title')) {
			return this.state.postTitle.length === 0;
		}
		if (!this.isFieldHidden('post_content')) {
			return this.state.postContent.length === 0;
		}
		return true;
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

		return (
			// possible hidden fields post_content, post_title, url, and thumbnail_id
			<article className={styles.wrapper}>
				{!this.isFieldHidden('post_title') && <input
					type="text"
					className={titleClasses}
					onChange={this.handleTitleChange}
					name="post_title"
					value={this.state.postTitle}
					placeholder={this.props.strings['label.title']}
				/>}
				{!this.isFieldHidden('post_content') && <textarea
					className={contentClasses}
					onChange={this.handleContentChange}
					name="post_content"
					value={this.state.postContent}
					placeholder={this.props.strings['label.content']}
				/>}
				{!this.isFieldHidden('url') && <input
					type="url"
					className={urlClasses}
					onChange={this.handleUrlChange}
					name="url"
					value={this.state.postUrl}
					placeholder={this.props.strings['label.link']}
				/>}
				{!this.isFieldHidden('thumbnail_id') && <MediaUploader
					label={this.props.label}
					size="large"
					file={AdminCache.getImageSrcById(this.state.imageId)}
					strings={this.props.strings}
					handleAddMedia={this.handleAddMedia}
					handleRemoveMedia={this.handleRemoveMedia}
				/>}
				<footer className={styles.footer}>
					<Button
						text={this.props.strings['button.add_to_panel']}
						primary={false}
						full={false}
						handleClick={this.handleAddToPanelClick}
						disabled={this.isAddBtnDisabled()}
					    rounded
					/>
					<Button
						text={this.props.strings['button.cancel_panel']}
						handleClick={this.handleCancelClick}
						full={false}
						bare
						rounded
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
	hiddenFields: PropTypes.array,
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
	hiddenFields: [],
	strings: {},
	editableId: '',
	handleCancelClick: () => {},
	handleAddClick: () => {},
};

export default PostListPostManual;
