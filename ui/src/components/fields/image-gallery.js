import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import escape from 'escape-html';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './image-gallery.pcss';

class ImageGallery extends Component {
	/**
	 * @param {props} props
	 * @constructs ImageGallery
	 */

	constructor(props) {
		super(props);

		const fid = _.uniqueId('field-');
		this.ids = {
			plContainer: `image-gallery-${fid}`,
		};
		this.frame = null;
		this.state = {
			attachments: [],
		};

		this.handleMediaButtonClick = this.handleMediaButtonClick.bind(this);
		this.overrideGalleryInsert = this.overrideGalleryInsert.bind(this);
		this.handleFrameInsertClick = this.handleFrameInsertClick.bind(this);
		this.hideGallerySidebar = this.hideGallerySidebar.bind(this);
	}

	/**
	 * Sets up the selection to be used by WP media selector
	 *
	 * @method buildSelection
	 */

	buildSelection(attachmentIds) {
		if (attachmentIds.length < 1) {
			return false;
		}

		const shortcode = new wp.shortcode({
			tag: 'gallery',
			attrs: { ids: attachmentIds.join(',') },
			type: 'single',
		});
		const attachments = wp.media.gallery.attachments(shortcode);
		const selection = new wp.media.model.Selection(attachments.models, {
			props: attachments.props.toJSON(),
			multiple: true,
		});
		selection.gallery = attachments.gallery;
		// Fetch the query"s attachments, and then break ties from the
		// query to allow for sorting.
		selection.more().done(() => {
			// Break ties with the query.
			selection.props.set({ query: false });
			selection.unmirror();
			selection.props.unset('orderby');
		});

		return selection;
	}

	/**
	 * Handler called after user closes the WP media selector frame
	 *
	 * @method handleFrameInsertClick
	 */

	handleFrameInsertClick() {
		const models = this.frame.state().get('library');
		const attachments = models.map((attachment) => {
			const att = attachment.toJSON();
			let thumbnail = '';
			if (att.sizes.hasOwnProperty('thumbnail')) {
				thumbnail = att.sizes.thumbnail.url;
			} else {
				// If it doesn't have a thumbnail, that's because it was
				// too small for WP to create one. Use the full size image.
				thumbnail = att.sizes.full.url;
			}
			return {
				id: att.id,
				thumbnail,	// shorthand
			};
		});
		this.setState({
			attachments, // shorthand
		});
		this.frame.close();
		this.frame = null;
	}

	/**
	 * Overrides the gallery insert with our own config and handlers
	 *
	 * @method overrideGalleryInsert
	 */

	overrideGalleryInsert() {
		this.frame.toolbar.get('view').set({
			insert: {
				style: 'primary',
				text: 'Save Gallery',  // to be translated
				click: this.handleFrameInsertClick,
			},
		});
	}

	/**
	 * Hides the sidebar. Passed to GallerySidebarHider
	 *
	 * @method hideGallerySidebar
	 */

	hideGallerySidebar() {
		if (this.frame) {
			this.frame.content.get('view').sidebar.unset('gallery'); // Hide Gallery Settings in sidebar
		}
	}

	/**
	 * Initiate the selection of new images for this gallery. Opens WP media window
	 *
	 * @method selectImages
	 */

	selectImages() {
		const ids = _.map(this.state.attachments, (attachment) => attachment.id);
		// Set frame object:
		this.frame = wp.media({
			frame: 'post',
			state: 'gallery-edit',
			title: 'Gallery',  // to be translated
			editing: true,
			multiple: true,
			selection: this.buildSelection(ids),
		});

		this.frame.open();

		const GallerySidebarHider = {};
		_.extend(GallerySidebarHider, Backbone.Events);
		GallerySidebarHider.hideGallerySidebar = this.hideGallerySidebar;
		GallerySidebarHider.listenTo(this.frame.state('gallery-edit'), 'activate', GallerySidebarHider.hideGallerySidebar);
		GallerySidebarHider.hideGallerySidebar();

		this.frame.on('toolbar:render:gallery-edit', this.overrideGalleryInsert);

		this.overrideGalleryInsert();
	}

	/**
	 * Handler for media button. Opens the media selector
	 *
	 * @method handleMediaButtonClick
	 */

	handleMediaButtonClick(event) {
		this.selectImages();
		event.preventDefault();
	}

	/**
	 * Inject to dom.
	 *
	 * @method render
	 */

	render() {
		const previewItems = _.map(this.state.attachments, (attachment, index) =>
			<div className={styles.galleryFieldItem} key={_.uniqueId('gallery-field-item-')}>
				<input type="hidden" name={`${this.props.name}[${index}][id]`} value={attachment.id} />
				<input type="hidden" name={`${this.props.name}[${index}][thumbnail]`} value={attachment.thumbnail} />
				<img src={attachment.thumbnail} alt={`thumnbail${attachment.id}`} />
			</div>
		);

		const descriptionStyles = classNames({
			[styles.description]: true,
			'pnl-field-description': true,
		});
		const labelStyles = classNames({
			[styles.label]: true,
			'pnl-field-label': true,
		});

		// Edit Gallery button to be translated
		return (
			<div className={styles.field}>
				<label className={labelStyles}>{this.props.label}</label>
				<div ref={this.ids.plContainer} id={this.ids.plContainer} data-label="Gallery" data-name={escape(this.props.name)}>
					<input type="hidden" name="gallery-field-name" value={this.props.name} />
					<p className={styles.galleryFieldControls}>
						<button className="button button-large" onClick={this.handleMediaButtonClick}>
							Edit Gallery
						</button>
					</p>
					<div className={styles.galleryFieldSelection} onClick={this.handleMediaButtonClick}>
						{previewItems}
					</div>
				</div>
				<p className={descriptionStyles}>{this.props.description}</p>
			</div>
		);
	}
}

ImageGallery.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.array,
	default: PropTypes.string,
};

ImageGallery.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
};

export default ImageGallery;
