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
		this.ids = {
			plContainer: `upload-ui-${fid}`,
			plDropElement: `drag-drop-area-${fid}`,
			plBrowseButton: `plupload-browse-button-${fid}`,
		};
		this.plupload = null;
		this.uploadDiv = null;
		this.dropDiv = null;

		this.handleAddMedia = this.handleAddMedia.bind(this);
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

	handleAddMedia(e) {
		e.preventDefault();

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
			console.log(attachment);
		});

		frame.open();
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
	 * Inject to dom.
	 *
	 * @method render
	 */

	render() {
		const currentClasses = classNames({
			open: true,
			[styles.currentUploadedImage]: true,
		});

		return (
			<div className="uploadContainer attachment-helper-uploader">
				<div className={currentClasses}>
					<img className="attachment-{this.props.size}" onClick={this.handleAddMedia} role="presentation" />
					<div className="wp-caption" onClick={this.handleAddMedia}></div>
					<p className="remove-button-container">
						<a className="button-secondary remove-image" href="#">
							{`${IMAGE_I18N.btn_remove} ${this.props.label}`}
						</a>
					</p>
				</div>
				<div className="uploaderSection">
					<div className="loading"></div>
					<div id={this.ids.plContainer} className="plupload-upload-ui" ref={this.ids.plContainer}>
						<div id={this.ids.plDropElement} className={styles.dragDropArea} ref={this.ids.plDropElement}>
							<div className={styles.dragDropInside}>
								<p className={styles.dragDropInfo}>{IMAGE_I18N.drp_info}</p>
								<p>{IMAGE_I18N.drp_or}</p>
								<p className="drag-drop-buttons">
									<a
										href="#"
										className="button attachment_helper_library_button"
										title="Add Media"
										data-size={this.props.size}
										onClick={this.handleAddMedia}
									>
										<span className="wp-media-buttons-icon"></span>
										<span>{IMAGE_I18N.btn_select}</span>
									</a>
								</p>
								<p className="drag-drop-buttons" style={{ display: 'none' }}>
									<input
										id={this.ids.plBrowseButton}
										type="button"
										value={IMAGE_I18N.btn_select}
										className="plupload-browse-button button"
									/>
								</p>
							</div>
						</div>
					</div>
				</div>
				<input
					type="hidden"
					name="this.name"
					value=""
					className="attachment_helper_value"
				/>
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
