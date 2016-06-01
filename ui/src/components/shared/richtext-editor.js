import React, { PropTypes } from 'react';

import { mediaButtonsHTML } from '../../globals/config';
import { TEXTAREA_I18N } from '../../globals/i18n';

/**
 * Stateless component for tinymce instance used throughout ui.
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

const RichtextEditor = (props) => {
	/**
	 * Sourced from window.ModularContent.media_buttons_html. This will contain the
	 * enabled buttons html for this tinymce instance.
	 *
	 * @method getMediaButtons
	 */

	const getMediaButtons = () => {
		const buttons = mediaButtonsHTML.replace('%EDITOR_ID%', props.fid);

		return props.buttons ? (
			<div
				id={`wp-${props.fid}-media-buttons`}
				className="wp-media-buttons"
				dangerouslySetInnerHTML={{ __html: buttons }}
			></div>
		) : null;
	};

	return (
		<article>
			<div id={`wp-${props.fid}-editor-tools`} className="wp-editor-tools hide-if-no-js">
				{getMediaButtons()}
				<div className="wp-editor-tabs">
					<button
						type="button"
						id={`${props.fid}-tmce`}
						className="wp-switch-editor switch-tmce"
						data-wp-editor-id={props.fid}
					>
						{TEXTAREA_I18N.tab_visual}
					</button>
					<button
						type="button"
						id={`${props.fid}-html`}
						className="wp-switch-editor switch-html"
						data-wp-editor-id={props.fid}
					>
						{TEXTAREA_I18N.tab_text}
					</button>
				</div>
			</div>
			<div
				data-settings_id={props.fid}
				id={`wp-${props.fid}-editor-container`}
				className="wp-editor-container"
			>
				<div
					data-settings_id={props.fid}
					id={`qt_${props.fid}_toolbar`}
					className="quicktags-toolbar"
				></div>
				<textarea
					className={`wysiwyg-${props.fid} wp-editor-area`}
					rows="15"
					cols="40"
					value={props.data}
					name={props.name}
					id={props.fid}
					onChange={props.onUpdate}
				/>
			</div>
		</article>
	);
};

RichtextEditor.propTypes = {
	data: PropTypes.string,
	fid: PropTypes.string,
	name: PropTypes.string,
	buttons: PropTypes.bool,
	onUpdate: PropTypes.func,
};

RichtextEditor.defaultProps = {
	data: '',
	fid: '',
	name: '',
	buttons: true,
	onUpdate: () => {},
};

export default RichtextEditor;

