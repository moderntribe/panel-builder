/**
 * @class TextArea
 * @package ModularContent\Fields
 *
 * A textarea. Set the argument 'richtext' to TRUE to use
 * a WordPress visual editor.
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { mediaButtonsHTML } from '../../globals/config';

import { tinyMCE, tinyMCEPreInit, switchEditors, QTags, quicktags } from '../../globals/wp';

import styles from './textarea.pcss';

class TextArea extends Component {
	/**
	 * @param {props} props
	 * @constructs TextArea
	 */

	constructor(props) {
		super(props);
		this.fid = _.uniqueId('textarea-field-');
		this.editor = null;
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		if (!this.props.richtext) {
			return;
		}

		this.cacheDom();
		this.initTinyMCE();
	}

	componentWillUnmount() {
		this.cleanUp();
	}

	/**
	 * Sourced from window.ModularContent.media_buttons_html. This will contain the
	 * enabled buttons html for this tinymce instance.
	 *
	 * @method getMediaButtons
	 */

	getMediaButtons() {
		const buttons = mediaButtonsHTML.replace('%EDITOR_ID%', this.fid);

		return this.props.media_buttons ? (
			<div
				id={`wp-${this.fid}-media-buttons`}
				className="wp-media-buttons"
				dangerouslySetInnerHTML={{ __html: buttons }}
			></div>
		) : null;
	}

	/**
	 * Depending on prop "richtext" this will return the jsx for a simple textarea or a dom ready to spin up a tinymce instance.
	 *
	 * @method getTemplate
	 */

	getTemplate() {
		let Editor;
		if (!this.props.richtext) {
			Editor = (
				<textarea
					className={styles.rawTextarea}
					id={this.fid}
					ref={this.fid}
					name={this.props.name}
					onChange={this.handleChange}
				/>
			);
		} else {
			const MediaButtons = this.getMediaButtons();
			Editor = (
				<div id={`wp-${this.fid}-wrap`} ref={this.fid} className="wp-core-ui wp-editor-wrap tmce-active">
					<div id={`wp-${this.fid}-editor-tools`} className="wp-editor-tools hide-if-no-js">
						{MediaButtons}
						<div className="wp-editor-tabs">
							<button
								type="button"
								id={`${this.fid}-tmce`}
								className="wp-switch-editor switch-tmce"
								data-wp-editor-id={this.fid}
							>
								Visual
							</button>
							<button
								type="button"
								id={`${this.fid}-html`}
								className="wp-switch-editor switch-html"
								data-wp-editor-id={this.fid}
							>
								Text
							</button>
						</div>
					</div>
					<div
						data-settings_id={this.fid}
						id={`wp-${this.fid}-editor-container`}
						className="wp-editor-container"
					>
						<div
							data-settings_id={this.fid}
							id={`qt_${this.fid}_toolbar`}
							className="quicktags-toolbar"
						></div>
						<textarea
							className={`wysiwyg-${this.fid} wp-editor-area`}
							rows="15"
							cols="40"
							name={this.props.name}
							id={this.fid}
							onChange={this.handleChange}
						/>
					</div>
				</div>
			);
		}

		return Editor;
	}

	handleChange(e) {
		// code to connect to actions that execute on redux store
		console.log(e.currentTarget.value);
	}

	/**
	 * Kick off the TinyMCE if called
	 *
	 * @method initTinyMCE
	 */

	initTinyMCE() {
		if (!this.props.richtext) {
			return;
		}

		tinyMCE.on('SetupEditor', (editor) => {
			if (editor.id === this.fid) {
				editor.on('change keyup paste', () => {
					// get us content on keyups, pastes and change for live update magic
					console.log(editor.getContent());
				});
			}
		});
		let settings = tinyMCEPreInit.mceInit[this.props.editor_settings_reference];
		const qtSettings = {
			id: this.fid,
			buttons: tinyMCEPreInit.qtInit[this.props.editor_settings_reference].buttons,
		};
		settings.selector = `#${this.fid}`;
		settings = tinyMCE.extend({}, tinyMCEPreInit.ref, settings);

		tinyMCEPreInit.mceInit[this.fid] = settings;
		tinyMCEPreInit.qtInit[this.fid] = qtSettings;
		quicktags(tinyMCEPreInit.qtInit[this.fid]);
		QTags._buttonsInit(); // eslint-disable-line no-underscore-dangle

		if (!window.wpActiveEditor) {
			window.wpActiveEditor = this.fid;
		}

		this.editor.addEventListener('click', () => {
			window.wpActiveEditor = this.fid;
		});

		if (this.editor.classList.contains('tmce-active')) {
			_.delay(() => {
				switchEditors.go(this.fid, 'tmce');
			}, 100);
		}
	}

	/**
	 * Cache the dom elements this component works on.
	 *
	 * @method cacheDom
	 */

	cacheDom() {
		this.editor = ReactDOM.findDOMNode(this.refs[this.fid]);
	}

	/**
	 * Remove events and destroy tinymce instance and settings on component unmount.
	 *
	 * @method cleanUp
	 */

	cleanUp() {
		if (!this.props.richtext) {
			return;
		}

		delete window.tinyMCEPreInit.mceInit[this.fid];
		delete window.tinyMCEPreInit.qtInit[this.fid];
		window.tinymce.execCommand('mceRemoveControl', true, this.fid);
		this.editor.removeEventListener('click', () => {
			window.wpActiveEditor = this.fid;
		});
	}

	/**
	 * Inject to dom.
	 *
	 * @method render
	 */

	render() {
		const Editor = this.getTemplate();

		return (
			<div className={styles.wrapper}>
				<label className={styles.label}>{this.props.label}</label>
				{Editor}
				<p className={styles.description}>{this.props.description}</p>
			</div>
		);
	}
}

TextArea.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.array,
	default: React.PropTypes.string,
	richtext: React.PropTypes.bool,
	media_buttons: React.PropTypes.bool,
	editor_settings_reference: React.PropTypes.string,
};

TextArea.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: [],
	default: '',
	richtext: false,
	media_buttons: true,
	editor_settings_reference: 'content',
};

export default TextArea;
