import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import LabelTooltip from './partials/label-tooltip';
import MediaUploader from '../shared/media-uploader';
import { wpMedia } from '../../globals/wp';

import styles from './image.pcss';
import * as styleUtil from '../../util/dom/styles';
import * as events from '../../util/events';
import { UI_I18N } from '../../globals/i18n';
import * as AdminCache from '../../util/data/admin-cache';

class File extends Component {
	state = {
		id: this.props.data,
		mime: AdminCache.getFilePropertyById(this.props.data, 'mime'),
		name: AdminCache.getFilePropertyById(this.props.data, 'name'),
		subtype: AdminCache.getFilePropertyById(this.props.data, 'subtype'),
		type: AdminCache.getFilePropertyById(this.props.data, 'type'),
	};

	/**
	 * Handles the media uploader open click. Will be hooked up to redux soon.
	 *
	 * @method handleAddMedia
	 */
	@autobind
	handleAddMedia() {
		const { allowed_mime_types, library_type } = this.props;
		const frame = wpMedia({
			multiple: false,
			library: {
				type: library_type,
			},
		});

		frame.on('select', () => {
			const attachment = frame.state().get('selection').first().toJSON();

			if (allowed_mime_types.length && allowed_mime_types.indexOf(attachment.mime) === -1) {
				events.trigger({
					event: 'modern_tribe/open_dialog',
					native: false,
					data: {
						type: 'error',
						heading: UI_I18N['message.not_allowed_file_type'],
					},
				});
				return;
			}
			const { id, name, subtype, type, mime } = AdminCache.cacheDataByAttachment(attachment, allowed_mime_types);

			this.setState({
				id,
				mime,
				name,
				subtype,
				type,
			});

			this.props.updatePanelData({
				depth: this.props.depth,
				indexMap: this.props.indexMap,
				parentMap: this.props.parentMap,
				name: this.props.name,
				value: id,
			});
		});

		frame.on('open', () => {
			if (!this.state.id) {
				return;
			}
			const attachment = wpMedia.attachment(this.state.id);
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
			id: 0,
			mime: '',
			name: '',
			subtype: '',
			type: '',
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
		const { label, description, strings } = this.props;
		const { mime, name, subtype, type } = this.state;

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{label}
					{description.length ? <LabelTooltip content={description} /> : null}
				</label>
				<MediaUploader
					label={name}
					file={name}
					fileType={type}
					subType={subtype}
					strings={strings}
					mime={mime}
					mode="file"
					handleAddMedia={this.handleAddMedia}
					handleRemoveMedia={this.handleRemoveMedia}
				/>
			</div>
		);
	}
}

File.propTypes = {
	allowed_mime_types: PropTypes.array,
	label: PropTypes.string,
	name: PropTypes.string,
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	depth: PropTypes.number,
	description: PropTypes.string,
	library_type: PropTypes.string,
	data: PropTypes.number,
	strings: PropTypes.object,
	default: PropTypes.number,
	panelIndex: PropTypes.number,
	layout: PropTypes.string,
	updatePanelData: PropTypes.func,
};

File.defaultProps = {
	allowed_mime_types: [],
	label: '',
	name: '',
	indexMap: [],
	parentMap: [],
	description: '',
	library_type: '',
	depth: 0,
	data: 0,
	strings: {},
	default: 0,
	panelIndex: 0,
	layout: '',
	updatePanelData: () => {},
};

export default File;
