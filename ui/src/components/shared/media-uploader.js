import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { IMAGE_I18N } from '../../globals/i18n';

import Button from './button';

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
			<img onClick={props.handleAddMedia} src={props.file} role="presentation" />
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

	const removeText = props.strings['button.remove'] ? props.strings['button.remove'] : IMAGE_I18N.button_default_remove;
	const addText = props.strings['button.select'] ? props.strings['button.select'] : IMAGE_I18N.button_default_add;

	return (
		<div>
			<div className={currentClasses}>
				{Preview}
				<p className={styles.removeButtonContainer}>
					<Button
						text={`${removeText} ${props.label}`}
						primary={false}
						handleClick={props.handleRemoveMedia}
					/>
				</p>
			</div>
			<div className={uploaderClasses}>
				<Button
					text={addText}
					classes="attachment_helper_library_button"
					handleClick={props.handleAddMedia}
				/>
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