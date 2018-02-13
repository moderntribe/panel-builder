import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import LabelTooltip from './partials/label-tooltip';
import MediaUploader from '../shared/media-uploader';
import { wpMedia } from '../../globals/wp';
import * as AdminCache from '../../util/data/admin-cache';

import styles from './image.pcss';
import * as styleUtil from '../../util/dom/styles';

class Image extends Component {
	state = {
		image: AdminCache.getImageSrcById(this.props.data),
		imageId: this.props.data,
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

		frame.on('select', () => {
			const attachment = frame.state().get('selection').first().toJSON();
			const image = AdminCache.cacheSrcByAttachment(attachment, this.props.allowed_image_mime_types);

			this.setState({
				image,
				imageId: attachment.id,
			});

			this.props.updatePanelData({
				depth: this.props.depth,
				indexMap: this.props.indexMap,
				parentMap: this.props.parentMap,
				name: this.props.name,
				value: attachment.id,
			});
		});

		frame.on('open', () => {
			if (!this.state.imageId) {
				return;
			}
			const attachment = wpMedia.attachment(this.state.imageId);
			attachment.fetch();
			frame.state().get('selection').add(attachment);
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
		this.setState({
			image: '',
			imageId: 0,
		});
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
			name: this.props.name,
			value: 0,
		});
	}

	/**
	 * Inject to dom.
	 *
	 * @method render
	 */

	render() {
		const { fieldClasses, labelClasses } = styleUtil.defaultFieldClasses(styles, this.props);

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>
				<MediaUploader
					label={this.props.label}
					file={this.state.image}
					strings={this.props.strings}
					handleAddMedia={this.handleAddMedia}
					handleRemoveMedia={this.handleRemoveMedia}
				/>
			</div>
		);
	}
}

Image.propTypes = {
	allowed_image_mime_types: PropTypes.array,
	label: PropTypes.string,
	name: PropTypes.string,
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	depth: PropTypes.number,
	description: PropTypes.string,
	data: PropTypes.number,
	strings: PropTypes.object,
	default: PropTypes.number,
	panelIndex: PropTypes.number,
	layout: PropTypes.string,
	updatePanelData: PropTypes.func,
};

Image.defaultProps = {
	allowed_image_mime_types: [],
	label: '',
	name: '',
	indexMap: [],
	parentMap: '',
	description: '',
	depth: 0,
	data: 0,
	strings: {},
	default: 0,
	panelIndex: 0,
	layout: '',
	updatePanelData: () => {},
};

export default Image;
