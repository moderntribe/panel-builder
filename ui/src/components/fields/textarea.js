/**
 * @class TextArea
 * @package ModularContent\Fields
 *
 * A textarea. Set the argument 'richtext' to TRUE to use
 * a WordPress visual editor. Use editor_type of 'draftjs' to use
 * a react powered customizable wysiwyg
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

import RichtextEditor from '../shared/richtext-editor';
import LabelTooltip from './partials/label-tooltip';
import DraftColorPicker from '../draftjs/color-picker';
import DraftAllCaps from '../draftjs/all-caps';
import { wpEditor } from '../../globals/wp';
import * as RichtextEvents from '../../util/dom/tinymce';
import * as DATA_KEYS from '../../constants/data-keys';
import getAllMatches from '../../util/data/get-all-matches';

import styles from './textarea.pcss';
import { trigger } from '../../util/events';
import * as EVENTS from '../../constants/events';

class TextArea extends Component {
	/**
	 * @param {props} props
	 * @constructs TextArea
	 */

	constructor(props) {
		super(props);
		this.fid = _.uniqueId('textarea-field-');
		this.state = {
			text: this.getInitialState(),
		};
	}

	getInitialState() {
		if (this.props.editor_type === DATA_KEYS.EDITOR_TYPE_DRAFTJS) {
			const contentBlock = htmlToDraft(this.props.data);
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
			return EditorState.createWithContent(contentState);
		}
		return this.props.data;
	}

	componentDidMount() {
		if (!this.props.richtext) {
			return;
		}
		if (this.props.editor_type === DATA_KEYS.EDITOR_TYPE_TINYMCE) {
			// delay for smooth animations, framerate killa
			_.delay(() => this.initTinyMCE(), 100);
		}
	}

	componentWillUnmount() {
		this.cleanUp();
	}

	@autobind
	onDraftJSChange(text) {
		this.setState({ text });
		const value = wpEditor.removep(draftToHtml(convertToRaw(text.getCurrentContent())));
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
			name: this.props.name,
			value,
		});
		if (this.props.enable_fonts_injection) {
			trigger({ event: EVENTS.INJECT_IFRAME_FONT, native: false, data: getAllMatches(value, /font-family:([^;]+);/g) });
		}
	}

	/**
	 * Depending on prop "richtext" this will return the jsx for a simple textarea or a dom ready to spin up a tinymce instance or a customized draftjs one.
	 *
	 * @method getTemplate
	 */

	getTemplate() {
		let FieldEditor;
		if (!this.props.richtext) {
			FieldEditor = (
				<textarea
					className={styles.rawTextarea}
					id={this.fid}
					ref={r => this.editor = r}
					name={`modular-content-${this.props.name}`}
					value={this.state.text}
					onChange={this.handleChange}
				/>
			);
		} else if (this.props.editor_type === DATA_KEYS.EDITOR_TYPE_TINYMCE) {
			FieldEditor = (
				<div
					id={`wp-${this.fid}-wrap`}
					ref={r => this.editor = r}
					className="wp-core-ui wp-editor-wrap tmce-active"
				>
					<RichtextEditor
						data={this.state.text}
						fid={this.fid}
						name={`modular-content-${this.props.name}`}
						buttons={this.props.media_buttons}
						strings={this.props.strings}
						onUpdate={this.handleChange}
					/>
				</div>
			);
		} else if (this.props.editor_type === DATA_KEYS.EDITOR_TYPE_DRAFTJS) {
			const toolbarOptions = this.props.editor_options;
			if (_.isArray(toolbarOptions.options) && toolbarOptions.options.indexOf('colorPicker') !== -1) {
				const colors = toolbarOptions.colorPicker && toolbarOptions.colorPicker.colors ? toolbarOptions.colorPicker.colors : [];
				toolbarOptions.colorPicker = { component: DraftColorPicker, colors };
			}
			FieldEditor = (
				<Editor
					editorState={this.state.text}
					toolbarClassName={styles.draftToolbar}
					wrapperClassName={styles.draftWrapper}
					editorClassName={styles.draftEditor}
					toolbarOnFocus
					toolbar={this.props.editor_options}
					onEditorStateChange={this.onDraftJSChange}
					toolbarCustomButtons={[<DraftAllCaps />]}
				/>
			);
		}

		return FieldEditor;
	}

	@autobind
	handleChange(data) {
		const text = data.currentTarget ? data.currentTarget.value : data;

		this.setState({ text });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
			name: this.props.name,
			value: text,
		});
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
		if (this.props.editor_type !== DATA_KEYS.EDITOR_TYPE_TINYMCE) {
			return;
		}

		RichtextEvents.init({
			editor: this.editor,
			fid: this.fid,
			editor_settings: this.props.editor_settings_reference,
		}, this.handleChange);
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
		if (this.props.editor_type !== DATA_KEYS.EDITOR_TYPE_TINYMCE) {
			return;
		}

		RichtextEvents.destroy({
			editor: this.editor,
			fid: this.fid,
		});
	}

	/**
	 * Inject to dom.
	 *
	 * @method render
	 */

	render() {
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
		});
		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>
				{this.getTemplate()}
			</div>
		);
	}
}

TextArea.propTypes = {
	data: PropTypes.string,
	panelIndex: PropTypes.number,
	enable_fonts_injection: PropTypes.bool,
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	depth: PropTypes.number,
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	strings: PropTypes.object,
	default: PropTypes.string,
	richtext: PropTypes.bool,
	editor_type: PropTypes.string,
	editor_options: PropTypes.object,
	media_buttons: PropTypes.bool,
	editor_settings_reference: PropTypes.string,
	updatePanelData: PropTypes.func,
};

TextArea.defaultProps = {
	data: '',
	panelIndex: 0,
	enable_fonts_injection: false,
	label: '',
	name: '',
	description: '',
	indexMap: [],
	parentMap: [],
	depth: 0,
	strings: {},
	default: '',
	richtext: false,
	media_buttons: true,
	editor_type: DATA_KEYS.EDITOR_TYPE_TINYMCE,
	editor_options: {},
	editor_settings_reference: 'content',
	updatePanelData: () => {},
};

export default TextArea;
