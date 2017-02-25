import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import MediaUploader from '../shared/media-uploader';
import { wpMedia } from '../../globals/wp';
import * as AdminCache from '../../util/data/admin-cache';

import styles from './image.pcss';

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
			const image = AdminCache.cacheSrcByAttachment(attachment);

			this.setState({
				image,
				imageId: attachment.id,
			});

			this.props.updatePanelData({
				index: this.props.panelIndex,
				name: this.props.name,
				value: attachment.id,
			});
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
			index: this.props.panelIndex,
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
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>{this.props.label}</label>
				<MediaUploader
					label={this.props.label}
					file={this.state.image}
					strings={this.props.strings}
					handleAddMedia={this.handleAddMedia}
					handleRemoveMedia={this.handleRemoveMedia}
				/>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Image.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	data: React.PropTypes.number,
	strings: React.PropTypes.object,
	default: React.PropTypes.string,
	panelIndex: React.PropTypes.number,
	updatePanelData: React.PropTypes.func,
};

Image.defaultProps = {
	label: '',
	name: '',
	description: '',
	data: 0,
	strings: {},
	default: '',
	panelIndex: 0,
	updatePanelData: () => {},
};

export default Image;
