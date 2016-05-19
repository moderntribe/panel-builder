import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';

import { tinyMCE, tinyMCEPreInit } from '../../globals/wp';

import styles from './textarea.pcss';

class TextArea extends Component {
	/**
	 * @param {props} props
	 * @constructs Image
	 */

	constructor(props) {
		super(props);
		this.fid = _.uniqueId('textarea-field-');

		// todo: move state to redux store
		this.state = {
			image: '',
			loading: false,
		};
		this.tinyMCEInstance = null;
	}

	componentDidMount() {
		if (!this.props.richtext) {
			return;
		}

		this.cacheDom();
		console.log(tinyMCEPreInit);
	}

	componentWillUnmount() {
		this.cleanUp();
	}

	getTemplate() {
		if (!this.props.richtext) {
			return(
				<textarea id={this.fid} ref={this.fid} />
			);
		} else {
			return (
				<div
					id={`wp-${this.fid}-wrap`}
					class="wp-core-ui wp-editor-wrap tmce-active"
				>
					<div
						id={`wp-${this.fid}-editor-tools`}
						class="wp-editor-tools hide-if-no-js"
					>
						<div
							id={`wp-${this.fid}-media-buttons`}
							class="wp-media-buttons"
						></div>
						<div class="wp-editor-tabs">
							<button
								type="button"
								id={`${this.fid}-tmce`}
								class="wp-switch-editor switch-tmce"
								data-wp-editor-id={this.fid}
							>
								Visual
							</button>
							<button
								type="button"
								id={`${this.fid}-html`}
								class="wp-switch-editor switch-html"
								data-wp-editor-id={this.fid}
							>
								Text
							</button>
					</div>
				</div>
					<div
						data-settings_id={this.fid}
						id={`wp-${this.fid}-editor-container`}
						class="wp-editor-container"
					>
						<div
							data-settings_id={this.fid}
							id={`qt_${this.fid}_toolbar`}
							class="quicktags-toolbar"
						></div>
						<textarea
							class={`wysiwyg-${this.fid} wp-editor-area`}
							rows="15"
							autocomplete="off"
							cols="40"
							name={`${this.props.name}[content]`}
							id={this.fid}
						></textarea>
					</div>
				</div>
			);
		}
	}

	/**
	 * Return element classes used by the render method. Uses classnames npm module for handling logic.
	 *
	 * @method getElementClasses
	 */

	getElementClasses() {
		const container = classNames({ [styles.uploaderContainer]: true });

		return {
			container,
		};
	}

	/**
	 * Kick off the TinyMCE if called
	 *
	 * @method initTinyMCE
	 */

	initTinyMCE() {
		// meh
	}

	/**
	 * Cache the dom elements this component works on.
	 *
	 * @method cacheDom
	 */

	cacheDom() {
		this.tinyMCEInstance = ReactDOM.findDOMNode(this.refs[this.ids.textarea]);
	}

	/**
	 * Remove events and destroy tinymce instance on component unmount.
	 *
	 * @method cleanUp
	 */

	cleanUp() {
		// cleanup
	}

	/**
	 * Inject to dom.
	 *
	 * @method render
	 */

	render() {
		const classes = this.getElementClasses();

		return (
			<div className={classes.container}>
				<textarea id={this.ids.textarea} ref={this.ids.textarea} />
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
