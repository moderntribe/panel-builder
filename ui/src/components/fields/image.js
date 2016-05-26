import React, { Component } from 'react';
import MediaUploader from '../shared/media-uploader';

import { wpMedia } from '../../globals/wp';

import styles from './image.pcss';

class Image extends Component {
	/**
	 * @param {props} props
	 * @constructs Image
	 */

	constructor(props) {
		super(props);

		// todo: move state to redux store
		this.state = {
			image: '',
		};

		this.handleAddMedia = this.handleAddMedia.bind(this);
		this.handleRemoveMedia = this.handleRemoveMedia.bind(this);
	}

	/**
	 * Handles the media uploader open click. Will be hooked up to redux soon.
	 *
	 * @method handleAddMedia
	 */

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

			// todo when hooking up store and have current image load selection
		});

		frame.on('select', () => {
			const attachment = frame.state().get('selection').first().toJSON();
			this.setState({ image: attachment.sizes[this.props.size].url });

			// todo when hooking up store trigger action which updates ui/store with image selection
		});

		frame.open();
	}

	/**
	 * Handles the removal of an image from state/store. Will be hooked up to redux soon.
	 *
	 * @method handleRemoveMedia
	 */

	handleRemoveMedia() {
		this.setState({ image: '' });
	}

	/**
	 * Inject to dom.
	 *
	 * @method render
	 */

	render() {
		return (
			<div className={styles.container}>
				<label className={styles.label}>{this.props.label}</label>
				<MediaUploader
					label={this.props.label}
					size={this.props.size}
					file={this.state.image}
					strings={this.props.strings}
					handleAddMedia={this.handleAddMedia}
					handleRemoveMedia={this.handleRemoveMedia}
				/>
				<p className={styles.description}>{this.props.description}</p>
			</div>
		);
	}
}

Image.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.object,
	default: React.PropTypes.string,
	size: React.PropTypes.string,
};

Image.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: {},
	default: '',
	size: 'thumbnail',
};

export default Image;
