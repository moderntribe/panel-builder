import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Button from './button';

import styles from './media-uploader.pcss';

const iconType = (props) => {
	let type = 'zip';
	if (props.fileType === 'image' || props.fileType === 'video' || props.fileType === 'audio') {
		type = props.fileType;
	}
	if (
		props.fileType === 'application' &&
		(
			props.subType === 'txt' ||
			props.subType === 'rtf' ||
			props.subType === 'pdf' ||
			props.subType === 'doc' ||
			props.subType === 'docx' ||
			props.subType === 'xls' ||
			props.subType === 'xlsx'
		)
	) {
		type = 'document';
	}
	return type;
};

/**
 * Stateless component for Media Upload used by multiple fields.
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const MediaUploader = (props) => {
	let Preview;
	switch (props.mode) {
	case 'image':
		Preview = (
			<div className={styles.imagePreview}>
				<img onClick={props.handleAddMedia} src={props.file} alt="" />
			</div>
		);
		break;
	default:
		Preview = (
			<div onClick={props.handleAddMedia} className={styles.filePreview}>
				<i className={styles.icon} data-type={iconType(props)} />
				<span className={styles.subtype}>{props.subType}</span>
				<span className={styles.label}>{props.label}</span>
			</div>
		);
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
		<div className={styles.container}>
			<div className={currentClasses}>
				{Preview}
				<p className={styles.removeButtonContainer}>
					<Button
						text={props.strings['button.remove']}
						primary={false}
						handleClick={props.handleRemoveMedia}
					/>
				</p>
			</div>
			<div className={uploaderClasses}>
				<Button
					text={props.strings['button.select']}
					classes="attachment_helper_library_button"
					handleClick={props.handleAddMedia}
				/>
			</div>
		</div>
	);
};

MediaUploader.propTypes = {
	label: PropTypes.string,
	fileMode: PropTypes.bool,
	fileType: PropTypes.string,
	size: PropTypes.string,
	file: PropTypes.string,
	mime: PropTypes.string,
	mode: PropTypes.string,
	subType: PropTypes.string,
	strings: PropTypes.object,
	handleAddMedia: PropTypes.func,
	handleRemoveMedia: PropTypes.func,
};

MediaUploader.defaultProps = {
	label: '',
	fileMode: false,
	fileType: 'image',
	size: 'thumbnail',
	file: '',
	subType: '',
	mode: 'image',
	mime: '',
	strings: {},
	handleAddMedia: () => {},
	handleRemoveMedia: () => {},
};

export default MediaUploader;
