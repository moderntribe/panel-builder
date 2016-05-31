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

import RichtextEditor from '../shared/richtext-editor';
import * as RichtextEvents from '../../util/dom/tinymce';
import LinkGroup from '../shared/link-group';
import ReactSelect from 'react-select-plus';


import styles from './post-quacker.pcss';

class PostQuacker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.default.type,
			image: '',
			title: '',
			content: '',
			post_types: [],
			posts: [],
			link_url: '',
			link_label: '',
			link_target: '_blank',
			search: '',
			loading: false,
			post: null,
			post_id: null,
		};

		this.noResults = {
			options: [{
				value: 0,
				label: 'No Results',
			}],
		};

		this.editor = null;
		this.fid = _.uniqueId('quacker-field-textfield-');
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
				<RichtextEditor fid={this.fid} name="content" buttons={false} value={this.state.content} onChange={this.handleTextChange} />
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

		return (
			<div className={tabClasses}>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>Title</label>
					<input type="text" name="title" value={this.state.title} size="40" onChange={this.handleTextChange} />
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>Image</label>
					<MediaUploader
						label="Image"
						size="large"
						file={this.state.image}
						strings={this.props.strings}
						handleAddMedia={this.handleAddMedia}
						handleRemoveMedia={this.handleRemoveMedia}
					/>
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>Content</label>
					{Editor}
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>Link</label>
					<LinkGroup valueTarget={this.state.link_target} valueUrl={this.state.link_url} valueLabel={this.state.link_label} />
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

		return (
			<div className={tabClasses}>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>Content Type</label>
					<ReactSelect
						name={_.uniqueId('quacker-type-selected-')}
						value={this.state.post_types}
						multi
						className={typeSelectClasses}
						placeholder="Select Post Types"
						options={this.props.post_type}
						onChange={this.handlePostTypeChange}
					/>
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>Select Content</label>
					<ReactSelect.Async
						disabled={this.state.post_types.length === 0}
						value={this.state.search}
						name="manual-selected-post"
						loadOptions={this.getOptions}
						isLoading={this.state.loading}
						onChange={this.handlePostSearchChange}
					/>
				</div>
				<div className={styles.panelFilterRow}>
					<Button
						text="Add to Module"
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
			if (attachment.sizes.full) {
				this.setState({ image: attachment.sizes.full.url });
			}

			// todo when hooking up store trigger action which updates ui/store with image selection
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
			image: '',
		});
	}

	/**
	 * Generic handler for changing text field
	 *
	 * @method handleTextChange
	 */
	@autobind
	handleTextChange(event) {
		this.setState({
			[event.currentTarget.name]: event.currentTarget.value,
		});
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
	 * Handler for post select change
	 *
	 * @method handlePostSearchChange
	 */
	@autobind
	handlePostSearchChange(data) {
		const search = data ? data.value : '';
		this.setState({
			search,
			post_id: data.value,
		});
	}

	/**
	 * Handler for after the preview is retrieved
	 *
	 * @method handleUpdatePreview
	 */
	@autobind
	handleUpdatePreview(err, response) {
		this.setState({
			post: response.body.data.posts[response.body.data.post_ids[0]],
		});
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
	 * Handler for Add to Module button
	 *
	 * @method handleAddToModuleClick
	 */
	@autobind
	handleAddToModuleClick() {
		if (this.state.post_id && this.state.post_id !== 0) {
			this.updatePreview(this.state.post_id);
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
	 * Handler for switching tabs
	 *
	 * @method switchTabs
	 */
	@autobind
	switchTabs(e) {
		const type = e.currentTarget.classList.contains('pq-show-manual') ? 'manual' : 'selection';
		this.setState({ type });
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
			editor_settings: 'slide_test-0000',
		});
	}

	render() {
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});
		const descriptionStyles = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});
		const fieldStyles = classNames({
			[styles.field]: true,
			'panel-field': true,
		});

		return (
			<fieldset className={fieldStyles}>
				<legend className={labelClasses}>{this.props.label}</legend>
				{this.getTabButtons()}
				<div className={styles.tabWrapper}>
					{this.getSelectionTemplate()}
					{this.getManualTemplate()}
				</div>
				<p className={descriptionStyles}>{this.props.description}</p>
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
	post: PropTypes.object,
	post_id: PropTypes.number,
};

PostQuacker.defaultProps = {
	label: '',
	name: '',
	description: '',
	post_type: [],
	strings: {},
	default: {},
	post: null,
	post_id: 0,
};

export default PostQuacker;
