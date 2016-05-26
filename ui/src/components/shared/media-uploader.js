import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './media-uploader.pcss';

/**
 * Stateless component for Media Upload used by multiple fields.
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const MediaUploader = (props) => {
	let Preview;
	switch (props.fileType) {
	case 'image':
		Preview = (
			<img onClick={props.handleAddMedia} src={props.file} role="presentation"/>
		);
		break;
	default:
		Preview = null;
	}

	const currentClasses = classNames({
		'current-file': true,
		[styles.currentOpen]: props.file.length,
		[styles.currentUploadedFile]: true,
	});

	const uploaderClasses = classNames({
		'file-uploader': true,
		[styles.uploaderOpen]: !props.file.length,
		[styles.uploaderSection]: true,
	});

	return (
		<div>
			<div className={currentClasses}>
				{Preview}
				<p className={styles.removeButtonContainer}>
					<button
						type="button"
						className="button-secondary"
						onClick={props.handleRemoveMedia}
					>
						{`${props.strings['button.remove']} ${props.label}`}
					</button>
				</p>
			</div>
			<div className={uploaderClasses}>
				<button
					type="button"
					className="button attachment_helper_library_button"
					title={props.strings['button.select']}
					data-size={props.size}
					onClick={props.handleAddMedia}
				>
					<span>{props.strings['button.select']}</span>
				</button>
			</div>
		</div>
	);
};

MediaUploader.propTypes = {
	label: PropTypes.string,
	fileType: PropTypes.string,
	size: PropTypes.string,
	file: PropTypes.string,
	strings: PropTypes.object,
	handleAddMedia: PropTypes.func,
	handleRemoveMedia: PropTypes.func,
};

MediaUploader.defaultProps = {
	label: '',
	fileType: 'image',
	size: 'medium',
	file: '',
	strings: {},
	handleAddMedia: () => {},
	handleRemoveMedia: () => {},
};

export default MediaUploader;
