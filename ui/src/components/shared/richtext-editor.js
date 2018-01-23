import PropTypes from 'prop-types';
import React from 'react';

import styles from './richtext-editor.pcss';

import { mediaButtonsHTML } from '../../globals/config';

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

	const getMediaButtons = () => { // eslint-disable-line
		return props.buttons ? (
			<div
				id={`wp-${props.fid}-media-buttons`}
				className="wp-media-buttons"
				dangerouslySetInnerHTML={{ __html: mediaButtonsHTML.replace('%EDITOR_ID%', props.fid) }}
			/>
		) : null;
	};

	return (
		<article className={styles.editor}>
			<div id={`wp-${props.fid}-editor-tools`} className="wp-editor-tools hide-if-no-js">
				{getMediaButtons()}
				<div className="wp-editor-tabs">
					<button
						type="button"
						id={`${props.fid}-tmce`}
						className="wp-switch-editor switch-tmce"
						data-wp-editor-id={props.fid}
					>
						{props.strings['tab.visual']}
					</button>
					<button
						type="button"
						id={`${props.fid}-html`}
						className="wp-switch-editor switch-html"
						data-wp-editor-id={props.fid}
					>
						{props.strings['tab.text']}
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
				/>
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
	strings: PropTypes.object,
	onUpdate: PropTypes.func,
};

RichtextEditor.defaultProps = {
	data: '',
	fid: '',
	name: '',
	buttons: true,
	strings: {},
	onUpdate: () => {},
};

export default RichtextEditor;
