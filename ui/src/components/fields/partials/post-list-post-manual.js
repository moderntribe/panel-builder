import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import { wpMedia } from '../../../globals/wp';

import MediaUploader from '../../shared/media-uploader';
import Button from '../../shared/button';

import styles from './post-list-post-manual.pcss';

class PostListPostManual extends Component {
	state = {
		image: '',
	};

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
			const selection = frame.state().get('selection');
			console.log(selection);
		});

		frame.on('select', () => {
			const attachment = frame.state().get('selection').first().toJSON();
			this.setState({ image: attachment.sizes.medium.url });
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
		this.setState({ image: '' });
	}

	@autobind
	handleAddToPanelClick() {

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
			<article className={styles.wrapper}>
				<input
					type="text"
					className={titleClasses}
					name="post_title"
					placeholder={this.props.strings['label.title']}
				/>
				<textarea
					className={contentClasses}
					name="post_content"
					placeholder={this.props.strings['label.content']}
				/>
				<input
					type="url"
					className={urlClasses}
					name="url"
					placeholder={this.props.strings['label.link']}
				/>
				<MediaUploader
					label={this.props.label}
					size="large"
					file={this.state.image}
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
					<a className={styles.footerLink} href="#">Cancel</a>
				</footer>
			</article>
		);
	}
}


PostListPostManual.propTypes = {
	label: PropTypes.string,
	strings: PropTypes.object,
};

PostListPostManual.defaultProps = {
	label: '',
	object: {},
};

export default PostListPostManual;
