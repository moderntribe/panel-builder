import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import escape from 'escape-html';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './image-gallery.pcss';
import { wpMedia, WPShortcode, panelBackbone } from '../../globals/wp';

class ImageGallery extends Component {
	state = {
		gallery: this.props.data ? this.props.data : this.props.default,
	};

	/**
	 * Sets up the selection to be used by WP media selector
	 *
	 * @method buildSelection
	 */

	buildSelection(attachmentIds) {
		if (attachmentIds.length < 1) {
			return false;
		}

		const shortcode = new WPShortcode({
			tag: 'gallery',
			attrs: { ids: attachmentIds.join(',') },
			type: 'single',
		});
		const attachments = wpMedia.gallery.attachments(shortcode);
		const selection = new wpMedia.model.Selection(attachments.models, {
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
	@autobind
	handleFrameInsertClick() {
		const models = this.frame.state().get('library');
		const gallery = models.map((attachment) => {
			const att = attachment.toJSON();
			let thumbnail = '';
			if (Object.prototype.hasOwnProperty.call(att.sizes, 'thumbnail')) {
				thumbnail = att.sizes.thumbnail.url;
			} else {
				// If it doesn't have a thumbnail, that's because it was
				// too small for WP to create one. Use the full size image.
				thumbnail = att.sizes.full.url;
			}
			return {
				id: att.id,
				thumbnail,
			};
		});
		this.setState({
			gallery,
		});
		this.props.updatePanelData({
			index: this.props.panelIndex,
			name: this.props.name,
			value: gallery,
		});
		this.frame.close();
		this.frame = null;
	}

	/**
	 * Overrides the gallery insert with our own config and handlers
	 *
	 * @method overrideGalleryInsert
	 */
	@autobind
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
	@autobind
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
		const ids = _.map(this.state.gallery, attachment => attachment.id);
		// Set frame object:
		this.frame = wpMedia({
			frame: 'post',
			state: 'gallery-edit',
			title: 'Gallery',  // to be translated
			editing: true,
			multiple: true,
			selection: this.buildSelection(ids),
		});

		this.frame.open();

		const GallerySidebarHider = {};
		_.extend(GallerySidebarHider, panelBackbone.Events);
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
	@autobind
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
		const previewItems = _.map(this.state.gallery, (attachment, index) =>
			<div className={styles.galleryFieldItem} key={_.uniqueId('gallery-field-item-')}>
				<input type="hidden" name={`${this.props.name}[${index}][id]`} value={attachment.id} />
				<input type="hidden" name={`${this.props.name}[${index}][thumbnail]`} value={attachment.thumbnail} />
				<img src={attachment.thumbnail} alt={`thumnbail${attachment.id}`} />
			</div>,
		);

		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
		});

		// Edit Gallery button to be translated
		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<div data-label="Gallery" data-name={escape(this.props.name)}>
					<input type="hidden" name="gallery-field-name" value={this.props.name} />
					<p className={styles.galleryFieldControls}>
						<button className="button button-large" onClick={this.handleMediaButtonClick}>
							{this.props.strings['button.edit_gallery']}
						</button>
					</p>
					<div className={styles.galleryFieldSelection} onClick={this.handleMediaButtonClick}>
						{previewItems}
					</div>
				</div>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

ImageGallery.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.object,
	default: PropTypes.string,
	data: PropTypes.array,
	panelIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
};

ImageGallery.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: {},
	default: '',
	data: [],
	panelIndex: 0,
	updatePanelData: () => {},
};

export default ImageGallery;
