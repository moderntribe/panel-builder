import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import { wpMedia } from '../../globals/wp';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import request from 'superagent';
import param from 'jquery-param';

import MediaUploader from '../shared/media-uploader';
import Button from '../shared/button';
import BlankPostUi from '../shared/blank-post-ui';
import PostPreview from '../shared/post-preview';
import LinkGroup from '../shared/link-group';
import RichtextEditor from '../shared/richtext-editor';

import * as RichtextEvents from '../../util/dom/tinymce';
import ReactSelect from 'react-select-plus';
import * as AdminCache from '../../util/data/admin-cache';
import { QUACKER_I18N } from '../../globals/i18n';

import styles from './post-quacker.pcss';

class PostQuacker extends Component {
	constructor(props) {
		super(props);
		this.noResults = {
			options: [{
				value: 0,
				label: this.props.strings.options_no_results ? this.props.strings.options_no_results : QUACKER_I18N.options_no_results,
			}],
		};
		this.state = {
			type: this.props.data.type ? this.props.data.type : this.props.default.type,
			image: this.props.data.image ? this.props.data.image : this.props.default.image,
			title: this.props.data.title ? this.props.data.title : this.props.default.title,
			content: this.props.data.content ? this.props.data.content : this.props.default.content,
			post_types: [], // selected post types
			link: this.props.data.link ? this.props.data.link : this.props.default.link,
			search: '', // search field query string
			loading: false,
			post: null,  // displayed post in the preview
			post_id_staged: null,
			post_id: this.props.data.post_id ? this.props.data.post_id : this.props.default.post_id,
		};
		this.editor = null;
		this.fid = _.uniqueId('quacker-field-textfield-');
		this.tid = _.uniqueId('quacker-field-title-');
	}

	componentWillMount() {
		if (this.state.post_id && this.state.post_id !== 0) {
			this.setState({
				post_id_staged: this.state.post_id,
			});
			this.updatePreview(this.state.post_id);
		}
	}

	componentDidMount() {
		this.cacheDom();
		this.initTinyMCE();
	}

	componentWillUnmount() {
		this.cleanUp();
	}

	/**
	 * Constructing rich text editor template
	 *
	 * @method getEditorTemplate
	 */

	getEditorTemplate() {
		return (
			<div
				id={`wp-${this.fid}-wrap`}
				ref={this.fid}
				className="wp-core-ui wp-editor-wrap tmce-active"
			>
				<RichtextEditor
					fid={this.fid}
					name={`${this.fid}-content`}
					buttons={false}
					data={this.state.content}
				/>
			</div>
		);
	}


	/**
	 * Constructing the tab buttons
	 *
	 * @method getTabButtons
	 */

	getTabButtons() {
		const manualButtonClasses = classNames({
			'pq-show-manual': true,
			[styles.active]: this.state.type === 'manual',
		});

		const queryButtonClasses = classNames({
			'pl-show-query': true,
			[styles.active]: this.state.type === 'selection',
		});

		return (
			<div className={styles.tabs}>
				<Button
					classes={queryButtonClasses}
					text={this.props.strings['tabs.selection']}
					full={false}
					handleClick={this.switchTabs}
				/>
				<Button
					classes={manualButtonClasses}
					text={this.props.strings['tabs.manual']}
					full={false}
					handleClick={this.switchTabs}
				/>
			</div>
		);
	}

	/**
	 * Constructing the manu view template
	 *
	 * @method getManualTemplate
	 */

	getManualTemplate() {
		const tabClasses = classNames({
			[styles.tabContent]: true,
			[styles.active]: this.state.type === 'manual',
		});

		const Editor = this.getEditorTemplate();
		const image = AdminCache.getImageById(this.state.image);
		let imagePath = '';
		if (image) {
			imagePath = image.full;
		}

		const labelTitleText = this.props.strings.label_manual_title ? this.props.strings.label_manual_title : QUACKER_I18N.label_manual_title;
		const labelImageText = this.props.strings.label_manual_image ? this.props.strings.label_manual_image : QUACKER_I18N.label_manual_image;
		const labelContentText = this.props.strings.label_manual_content ? this.props.strings.label_manual_content : QUACKER_I18N.label_manual_content;
		const labelLinkText = this.props.strings.label_manual_link ? this.props.strings.label_manual_link : QUACKER_I18N.label_manual_link;
		const labelImageLabelText = this.props.strings.label_manual_image_label ? this.props.strings.label_manual_image_label : QUACKER_I18N.label_manual_image_label;

		return (
			<div className={tabClasses}>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{labelTitleText}</label>
					<input type="text" name={this.tid} value={this.state.title} size="40" onChange={this.handleTitleChange} />
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{labelImageText}</label>
					<MediaUploader
						label={labelImageLabelText}
						size={this.props.size}
						file={imagePath}
						strings={this.props.strings}
						handleAddMedia={this.handleAddMedia}
						handleRemoveMedia={this.handleRemoveMedia}
					/>
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{labelContentText}</label>
					{Editor}
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{labelLinkText}</label>
					<LinkGroup handleURLChange={this.handleURLChange} handleTargetChange={this.handleTargetChange} handleLabelChange={this.handleLabelChange} valueTarget={this.state.link.target} valueUrl={this.state.link.url} valueLabel={this.state.link.label} />
				</div>
			</div>
		);
	}

	/**
	 * Constructing the selection view template
	 *
	 * @method getSelectionTemplate
	 */

	getSelectionTemplate() {
		const tabClasses = classNames({
			[styles.tabContent]: true,
			[styles.active]: this.state.type === 'selection',
		});
		const typeSelectClasses = classNames({
			'post-type-select': true,
			'term-select': true,
		});

		const labelTypeText = this.props.strings.label_selection_type ? this.props.strings.label_selection_type : QUACKER_I18N.label_selection_type;
		const labelTypePlaceholderText = this.props.strings.placeholder_selection_type ? this.props.strings.placeholder_selection_type : QUACKER_I18N.placeholder_selection_type;
		const labelContentText = this.props.strings.label_selection_post ? this.props.strings.label_selection_post : QUACKER_I18N.label_selection_post;
		const labelContentPlaceholderText = this.props.strings.placeholder_selection_post? this.props.strings.placeholder : QUACKER_I18N.placeholder_selection_type;
		const labelAddToModule = this.props.strings.button_add_to_module ? this.props.strings.button_add_to_module : QUACKER_I18N.button_add_to_module;

		return (
			<div className={tabClasses}>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{labelTypeText}</label>
					<ReactSelect
						name={_.uniqueId('quacker-type-selected-')}
						value={this.state.post_types}
						multi
						className={typeSelectClasses}
						placeholder={labelTypePlaceholderText}
						options={this.props.post_type}
						onChange={this.handlePostTypeChange}
					/>
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{labelContentText}</label>
					<ReactSelect.Async
						disabled={!this.state.post_types || this.state.post_types.length === 0}
						value={this.state.search}
						name="manual-selected-post"
						loadOptions={this.getOptions}
						placeholder={labelContentPlaceholderText}
						isLoading={this.state.loading}
						onChange={this.handlePostSearchChange}
					/>
				</div>
				<div className={styles.panelFilterRow}>
					<Button
						text={labelAddToModule}
						primary={false}
						full={false}
						handleClick={this.handleAddToModuleClick}
					/>
				</div>
				{!this.state.post && <div className={styles.panelFilterRow}>
					<div className={styles.blankPostContainer}>
						<div><BlankPostUi /></div>
					</div>
				</div>}
				{this.state.post && <div className={styles.panelFilterRow}>
					<PostPreview title={this.state.post.post_title} excerpt={this.state.post.post_excerpt} thumbnail={this.state.post.thumbnail_html} onRemoveClick={this.handleRemovePostClick} />
				</div>}
			</div>
		);
	}

	/**
	 * Handler to pass into react select for showing posts
	 *
	 * @method getOptions
	 */
	@autobind
	getOptions(input, callback) {
		let data = this.noResults;
		if (!this.state.post_types.length && !input.length) {
			callback(null, data);
			return;
		}
		this.setState({ loading: true });
		const ajaxURL = `${window.ajaxurl}?${this.getSearchRequestParams(input)}`;
		request.get(ajaxURL).end((err, response) => {
			this.setState({ loading: false });
			if (response.body.posts.length) {
				data = {
					options: response.body.posts,
				};
			}
			callback(null, data);
		});
	}

	/**
	 * Get search params for posts limited by type
	 *
	 * @method updatePreview
	 */
	getSearchRequestParams(input) {
		const types = [];
		_.forEach(this.state.post_types, (type) => {
			types.push(type.value);
		});
		return param({
			action: 'posts-field-posts-search',
			s: input,
			type: 'query-panel',
			paged: 1,
			post_type: types,
			field_name: 'items',
		});
	}

	/**
	 * Retrieves a snapshot of this fields persistent data
	 *
	 * @method getValue
	 */
	getValue() {
		return {
			type: this.state.type,
			title: this.state.title,
			content: this.state.content,
			image: this.state.image,
			post_id: this.state.post_id,
			link: this.state.link,
		};
	}

	@autobind
	handleURLChange(e) {
		const url = e.currentTarget.value;
		const link = _.cloneDeep(this.state.link);
		link.url = url;
		this.setState({ link }, this.initiateUpdatePanelData);
	}

	@autobind
	handleLabelChange(e) {
		const label = e.currentTarget.value;
		const link = _.cloneDeep(this.state.link);
		link.label = label;
		this.setState({ link }, this.initiateUpdatePanelData);
	}

	@autobind
	handleTargetChange(data) {
		const target = data.value.length ? data.value : '_self';
		const link = _.cloneDeep(this.state.link);
		link.target = target;
		this.setState({ link }, this.initiateUpdatePanelData);
	}

	/**
	 * Handler for post select change
	 *
	 * @method handlePostSearchChange
	 */
	@autobind
	handlePostSearchChange(data) {
		const search = data ? data.value : '';
		this.setState({
			search,
			post_id_staged: data.value,
		});
		this.initiateUpdatePanelData();
	}

	/**
	 * Handler for when post type changes
	 *
	 * @method handlePostTypeChange
	 */
	@autobind
	handlePostTypeChange(types) {
		this.setState({
			post_types: types,
		});
	}

	/**
	 * Handler for after the preview is retrieved
	 *
	 * @method handleUpdatePreview
	 */
	@autobind
	handleUpdatePreview(err, response) {
		const postId = this.state.post_id_staged;
		this.setState({
			post: response.body.data.posts[response.body.data.post_ids[0]],
			post_id: postId,
		});
		this.initiateUpdatePanelData();
	}

	/**
	 * Handler for Add to Module button
	 *
	 * @method handleAddToModuleClick
	 */
	@autobind
	handleAddToModuleClick() {
		if (this.state.post_id_staged && this.state.post_id_staged !== 0) {
			this.updatePreview(this.state.post_id_staged);
		}
	}

	/**
	 * Called to update the preview after a use selects a new post
	 *
	 * @method updatePreview
	 */
	updatePreview(id) {
		const params = param({
			action: 'posts-field-fetch-preview',
			post_ids: [id],
		});
		request
			.post(window.ajaxurl)
			.send(params)
			.end(this.handleUpdatePreview);
	}

	/**
	 * Handler for content field richtext
	 *
	 * @method handleRichtextChange
	 */
	@autobind
	handleRichtextChange(data) {
		this.setState({
			content: data,
		});
		this.initiateUpdatePanelData();
	}


	/**
	 * Generic handler for changing text field
	 *
	 * @method handleTitleChange
	 */
	@autobind
	handleTitleChange(event) {
		const title = event.currentTarget.value;
		this.setState({
			title,
		});
		this.initiateUpdatePanelData();
	}

	/**
	 * Handler for Add Media button
	 *
	 * @method handleAddMedia
	 */
	@autobind
	handleAddMedia() {
		const frame = wpMedia({
			multiple: false,
			library: {
				type: 'image',
			},
		});

		frame.on('open', () => {
			// todo when hooking up store and have current image load selection
		});

		frame.on('select', () => {
			const attachment = frame.state().get('selection').first().toJSON();
			AdminCache.addImage(attachment);
			this.setState({ image: attachment.id });
			this.initiateUpdatePanelData();
		});
		frame.open();
	}

	/**
	 * Handles the removal of an image from state/store.
	 *
	 * @method handleRemoveMedia
	 */
	@autobind
	handleRemoveMedia() {
		this.setState({
			image: 0,
		});
		this.initiateUpdatePanelData();
	}

	/**
	 * Handler for Remove Post Click
	 *
	 * @method handleRemovePostClick
	 */
	@autobind
	handleRemovePostClick() {
		// add the selected post to this field
		this.setState({
			post: null,
			post_id: 0,
		});
		this.initiateUpdatePanelData();
	}

	/**
	 * Handler for switching tabs
	 *
	 * @method switchTabs
	 */
	@autobind
	switchTabs(e) {
		const type = e.currentTarget.classList.contains('pq-show-manual') ? 'manual' : 'selection';
		this.setState({
			type,
		}, this.initiateUpdatePanelData);
	}

	/**
	 * Updating the panel data upstream
	 *
	 * @method initiateUpdatePanelData
	 */
	@autobind
	initiateUpdatePanelData() {
		this.props.updatePanelData({
			index: this.props.panelIndex,
			name: this.props.name,
			value: this.getValue(),
		});
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
		RichtextEvents.destroy({
			editor: this.editor,
			fid: this.fid,
		});
	}

	/**
	 * Kick off the TinyMCE if called
	 *
	 * @method initTinyMCE
	 */

	initTinyMCE() {
		RichtextEvents.init({
			editor: this.editor,
			fid: this.fid,
			editor_settings: this.props.editor_settings_reference,
		}, this.handleRichtextChange);
	}

	render() {
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
		});

		return (
			<fieldset className={fieldClasses}>
				<legend className={labelClasses}>{this.props.label}</legend>
				{this.getTabButtons()}
				<div className={styles.tabWrapper}>
					{this.getSelectionTemplate()}
					{this.getManualTemplate()}
				</div>
				<p className={descriptionClasses}>{this.props.description}</p>
			</fieldset>
		);
	}
}

PostQuacker.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	post_type: PropTypes.array,
	strings: PropTypes.object,
	default: PropTypes.object,
	post_id: PropTypes.number,
	editor_settings_reference: PropTypes.string,
	data: React.PropTypes.object,
	panelIndex: React.PropTypes.number,
	updatePanelData: React.PropTypes.func,
	size: React.PropTypes.string,
};

PostQuacker.defaultProps = {
	label: '',
	name: '',
	description: '',
	post_type: [],
	strings: {},
	default: {},
	post_id: 0,
	editor_settings_reference: 'content',
	data: {},
	panelIndex: 0,
	updatePanelData: () => {},
	size: 'thumbnail',
};

export default PostQuacker;
