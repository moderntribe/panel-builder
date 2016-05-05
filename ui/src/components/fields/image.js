import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';
import deepAssign from 'deep-assign';

import { IMAGE_CONFIG } from '../../globals/config';
import { IMAGE_I18N } from '../../globals/i18n';
import { wpMedia, PlUploader } from '../../globals/wp';

import styles from './image.pcss';

class Image extends Component {
	/**
	 * @param {props} props
	 * @constructs Image
	 */

	constructor(props) {
		super(props);
		const fid = _.uniqueId('image-field-');

		// todo: move state to redux store
		this.state = {
			image: '',
		};
		this.ids = {
			plContainer: `upload-ui-${fid}`,
			plDropElement: `drag-drop-area-${fid}`,
			plBrowseButton: `plupload-browse-button-${fid}`,
		};
		this.plupload = null;
		this.uploadDiv = null;
		this.dropDiv = null;

		this.handleAddMedia = this.handleAddMedia.bind(this);
		this.handleRemoveMedia = this.handleRemoveMedia.bind(this);
	}

	componentDidMount() {
		this.cacheDom();
		this.initPlUpload();
	}

	componentWillUnmount() {
		this.cleanUp();
	}

	/**
	 * Creates a unique settings group of ids and image size for this instance and merges that with defaults supplied by
	 * localize script to pass to plupload.
	 *
	 * @method getPlSettings
	 */

	getPlSettings() {
		return deepAssign(_.cloneDeep(IMAGE_CONFIG.plupload), {
			container: this.ids.plContainer,
			drop_element: this.ids.plDropElement,
			browse_button: this.ids.plBrowseButton,
			multipart_params: {
				size: this.props.size,
			},
		});
	}

	/**
	 * Remove events and destroy plupload instance on component unmount.
	 *
	 * @method cleanUp
	 */

	cleanUp() {
		this.plupload.destroy();
		this.removeDragEvents();
	}

	/**
	 * Cache the dom elements this component works on. Needed to work with plupload.
	 *
	 * @method cacheDom
	 */

	cacheDom() {
		this.uploadDiv = ReactDOM.findDOMNode(this.refs[this.ids.plContainer]);
		this.dropDiv = ReactDOM.findDOMNode(this.refs[this.ids.plDropElement]);
	}

	/**
	 * Bind the drag and drop events for plupload on the stored elements after component mount.
	 *
	 * @method addDragEvents
	 */

	addDragEvents() {
		this.dropDiv.addEventListener('dragover', () => this.uploadDiv.classList.add('drag-over'));
		this.dropDiv.addEventListener('dragleave', this.uploadDiv.classList.remove('drag-over'));
		this.dropDiv.addEventListener('drop', this.uploadDiv.classList.remove('drag-over'));
	}

	/**
	 * This one calls add or remove for the drag events on plupload.
	 *
	 * @method bindDropEvents
	 */

	bindDropEvents() {
		this.plupload.bind('Init', () => {
			if (this.plupload.features.dragdrop) {
				this.uploadDiv.classList.add('drag-drop');
				this.addDragEvents();
			} else {
				this.uploadDiv.classList.remove('drag-drop');
				this.removeDragEvents();
			}
		});
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
			console.log(attachment);
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
	 * Kick off the plupload config on component mount.
	 *
	 * @method initPlUpload
	 */

	initPlUpload() {
		const settings = this.getPlSettings();

		this.plupload = new PlUploader(settings);
		this.plupload.size = this.props.size;
		this.plupload.type = 'image';
		this.bindDropEvents();
		this.plupload.init();
	}

	/**
	 * Clear out listeners for the plupload drag and drop events.
	 *
	 * @method removeDragEvents
	 */

	removeDragEvents() {
		this.dropDiv.removeEventListener('dragover', () => this.uploadDiv.classList.add('drag-over'));
		this.dropDiv.removeEventListener('dragleave', this.uploadDiv.classList.remove('drag-over'));
		this.dropDiv.removeEventListener('drop', this.uploadDiv.classList.remove('drag-over'));
	}

	/**
	 * Return element classes used by the render method. Uses classnames npm module for handling logic.
	 *
	 * @method getElementClasses
	 */

	getElementClasses() {
		const container = classNames({
			[styles.currentOpen]: this.state.image.length,
			[styles.currentUploadedImage]: true,
		});
		
		const current = classNames({
			[styles.currentOpen]: this.state.image.length,
			[styles.currentUploadedImage]: true,
		});

		const img = classNames(
			`attachment-${this.props.size}`,
		);

		const uploader = classNames({
			[styles.uploaderOpen]: !this.state.image.length,
			[styles.uploaderSection]: true,
		});

		return {
			current,
			img,
			uploader,
		};
	};

	/**
	 * Inject to dom.
	 *
	 * @method render
	 */

	render() {
		const classes = this.getElementClasses();

		return (
			<div className="uploadContainer attachment-helper-uploader">
				<div className={classes.current}>
					<img className={classes.img} onClick={this.handleAddMedia} src={this.state.image} role="presentation" />
					<div className="wp-caption" onClick={this.handleAddMedia}></div>
					<p className={styles.removeButtonContainer}>
						<button
							type="button"
							className="button-secondary remove-image"
							onClick={this.handleRemoveMedia}
						>
							{`${IMAGE_I18N.btn_remove} ${this.props.label}`}
						</button>
					</p>
				</div>
				<div className={classes.uploader}>
					<div className="loading"></div>
					<div id={this.ids.plContainer} className="plupload-upload-ui" ref={this.ids.plContainer}>
						<div id={this.ids.plDropElement} className={styles.dragDropArea} ref={this.ids.plDropElement}>
							<div className={styles.dragDropInside}>
								<p className={styles.dragDropInfo}>{IMAGE_I18N.drp_info}</p>
								<p>{IMAGE_I18N.drp_or}</p>
								<p className="drag-drop-buttons">
									<button
										type="button"
										className="button attachment_helper_library_button"
										title="Add Media"
										data-size={this.props.size}
										onClick={this.handleAddMedia}
									>
										<span>{IMAGE_I18N.btn_select}</span>
									</button>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Image.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.array,
	default: React.PropTypes.string,
	size: React.PropTypes.string,
};

Image.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
	size: 'thumbnail',
};

export default Image;
