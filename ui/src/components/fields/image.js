import React, { Component } from 'react';
import classNames from 'classnames';

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
	 * Return element classes used by the render method. Uses classnames npm module for handling logic.
	 *
	 * @method getElementClasses
	 */

	getElementClasses() {
		const container = classNames({ [styles.uploaderContainer]: true });
		const label = classNames({ [styles.panelInputLabel]: true });
		const description = classNames({ [styles.panelInputDescription]: true });
		const current = classNames({
			'current-image': true,
			[styles.currentOpen]: this.state.image.length,
			[styles.currentUploadedImage]: true,
		});
		const uploader = classNames({
			'image-uploader': true,
			[styles.uploaderOpen]: !this.state.image.length,
			[styles.uploaderSection]: true,
		});

		return {
			container,
			label,
			current,
			uploader,
			description,
		};
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
		const classes = this.getElementClasses();

		return (
			<div className={classes.container}>
				<label className={classes.label}>{this.props.label}</label>
				<div className={classes.current}>
					<img onClick={this.handleAddMedia} src={this.state.image} role="presentation" />
					<div className="wp-caption" onClick={this.handleAddMedia}></div>
					<p className={styles.removeButtonContainer}>
						<button
							type="button"
							className="button-secondary remove-image"
							onClick={this.handleRemoveMedia}
						>
							{`${this.props.strings['button.remove']} ${this.props.label}`}
						</button>
					</p>
				</div>
				<div className={classes.uploader}>
					<button
						type="button"
						className="button attachment_helper_library_button"
						title={this.props.strings['button.select']}
						data-size={this.props.size}
						onClick={this.handleAddMedia}
					>
						<span>{this.props.strings['button.select']}</span>
					</button>
				</div>
				<p className={classes.description}>{this.props.description}</p>
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
