import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';
import _ from 'lodash';
import request from 'superagent';
import param from 'jquery-param';

import { wpMedia } from '../../globals/wp';
import MediaUploader from '../shared/media-uploader';
import Button from '../shared/button';
import BlankPostUi from '../shared/blank-post-ui';
import PostPreviewContainer from '../shared/post-preview-container';
import LinkGroup from '../shared/link-group';
import RichtextEditor from '../shared/richtext-editor';
import LabelTooltip from './partials/label-tooltip';

import * as RichtextEvents from '../../util/dom/tinymce';
import * as AdminCache from '../../util/data/admin-cache';

import styles from './post-quacker.pcss';

class PostQuacker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.data.type,
			image: this.props.data.image,
			title: this.props.data.title,
			content: this.props.data.content,
			post_types: [], // selected post types
			link: this.props.data.link,
			search: '', // search field query string
			loading: false,
			post: null,  // displayed post in the preview
			post_id_staged: null,
			post_id: this.props.data.post_id,
			options: [],
			inputValue: '',
		};
		this.editor = null;
		this.request = null;
		this.fid = _.uniqueId('quacker-field-textfield-');
		this.tid = _.uniqueId('quacker-field-title-');
	}

	componentWillMount() {
		if (this.state.post_id && this.state.post_id !== 0) {
			this.setState({
				post_id_staged: this.state.post_id,
				post_id: this.state.post_id,
			});
		}
	}

	componentDidMount() {
		// delay for smooth animations, framerate killa
		_.delay(() => {
			this.initTinyMCE();
		}, 100);
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
		const editorClasses = classNames({
			'wp-core-ui': true,
			'wp-editor-wrap': true,
			'tmce-active': true,
		});
		return (
			<div
				id={`wp-${this.fid}-wrap`}
				ref={r => this.editor = r}
				className={editorClasses}
			>
				<RichtextEditor
					fid={this.fid}
					name={`${this.fid}-content`}
					buttons={false}
					strings={this.props.strings}
					data={this.state.content}
					onUpdate={this.handleRichtextChange}
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
					text={this.props.strings['tab.selection']}
					full={false}
					handleClick={this.switchTabs}
				/>
				<Button
					classes={manualButtonClasses}
					text={this.props.strings['tab.manual']}
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
		const link = this.state.link || {};

		return (
			<div className={tabClasses}>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{this.props.strings['label.manual_title']}</label>
					<input type="text" name={this.tid} value={this.state.title} size="40" onChange={this.handleTitleChange} />
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{this.props.strings['label.manual_image']}</label>
					<MediaUploader
						label={this.props.strings['label.manual_image']}
						size={this.props.size}
						file={AdminCache.getImageSrcById(this.state.image)}
						strings={this.props.strings}
						handleAddMedia={this.handleAddMedia}
						handleRemoveMedia={this.handleRemoveMedia}
					/>
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{this.props.strings['label.manual_content']}</label>
					{Editor}
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{this.props.strings['label.manual_link']}</label>
					<LinkGroup
						handleURLChange={this.handleURLChange}
						handleTargetChange={this.handleTargetChange}
						handleLabelChange={this.handleLabelChange}
						valueTarget={link.target}
						valueUrl={link.url}
						valueLabel={link.label}
						strings={this.props.strings}
					/>
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

		let Preview;
		if (this.state.post_id && this.state.post_id !== 0) {
			Preview = (<div className={styles.panelFilterRow}>
				<PostPreviewContainer post_id={this.state.post_id.toString()} onRemoveClick={this.handleRemovePostClick} />
			</div>);
		} else {
			Preview = (<div className={styles.panelFilterRow}>
				<div className={styles.blankPostContainer}>
					<div><BlankPostUi /></div>
				</div>
			</div>);
		}
		const noResultsTextSearch = (this.state.inputValue) ? this.props.strings['placeholder.no_results'] : this.props.strings['placeholder.select_search'];
		return (
			<div className={tabClasses}>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{this.props.strings['label.select_post_type']}</label>
					<ReactSelect
						name={_.uniqueId('quacker-type-selected-')}
						value={this.state.post_types}
						multi
						className={typeSelectClasses}
						placeholder={this.props.strings['placeholder.select_post_type']}
						options={this.props.post_type}
						onChange={this.handlePostTypeChange}
					/>
				</div>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>{this.props.strings['label.select_post']}</label>
					<ReactSelect
						disabled={!this.state.post_types || this.state.post_types.length === 0}
						value={this.state.search}
						name={_.uniqueId('quacker-search-selected-')}
						options={this.state.options}
						onInputChange={this.handleOnPostInputChange}
						noResultsText={noResultsTextSearch}
						placeholder={this.props.strings['placeholder.select_post']}
						isLoading={this.state.loading}
						onBlur={this.handlePostSearchBlur}
						onChange={this.handlePostSearchChange}
					/>
				</div>
				<div className={styles.panelFilterRow}>
					<Button
						text={this.props.strings['button.add_to_module']}
						primary={false}
						full={false}
						handleClick={this.handleAddToModuleClick}
						rounded
					/>
				</div>
				{Preview}
			</div>
		);
	}

	/**
	 * Get search params for posts limited by type
	 *
	 * @method getSearchRequestParams
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

	/**
	 * Handler for content field richtext
	 *
	 * @method handleRichtextChange
	 */
	@autobind
	handleRichtextChange(data) {
		const content = data.currentTarget ? data.currentTarget.value : data;
		this.setState({
			content,
		}, this.initiateUpdatePanelData);
	}

	/**
	 * Handler on input change per select
	 *
	 * @method onInputChange
	 */
	@autobind
	handleOnPostInputChange(input) {
		this.setState({ inputValue: input });
		if (!this.state.post_types.length || !input.length) {
			this.setState({
				options: [],
			});
			return;
		}
		this.setState({ loading: true });
		const ajaxURL = `${window.ajaxurl}?${this.getSearchRequestParams(input)}`;
		if (this.request) {
			this.request.abort();
		}
		this.request = request.get(ajaxURL).end((err, response) => {
			if (!err) {
				this.setState({ loading: false });
				if (response.body.posts.length) {
					this.setState({
						options: response.body.posts,
					});
				}
			}
		});
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
		if (data) {
			this.setState({
				search: data.value,
				post_id_staged: data.value,
				inputValue: '',
			}, this.initiateUpdatePanelData);
		} else {
			this.setState({
				search: '',
				post_id_staged: null,
				inputValue: '',
				options: [],
			}, this.initiateUpdatePanelData);
		}
	}

	/**
	 * Handler for post select blur
	 *
	 * @method handlePostSearchBlur
	 */
	@autobind
	handlePostSearchBlur() {
		if (!this.state.search) {
			this.setState({
				options: [],
				inputValue: '',
			});
		}
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
	 * Handler for Add to Module button
	 *
	 * @method handleAddToModuleClick
	 */
	@autobind
	handleAddToModuleClick() {
		// first remove if necessary
		this.setState({
			post: null,
			post_id: this.state.post_id_staged,
			search: '',
			options: [],
			inputValue: '',
		}, this.initiateUpdatePanelData);
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
		}, this.initiateUpdatePanelData);
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
			AdminCache.cacheSrcByAttachment(attachment);
			this.setState({ image: attachment.id }, this.initiateUpdatePanelData);
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
		}, this.initiateUpdatePanelData);
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
		}, this.initiateUpdatePanelData);
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
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value: this.getValue(),
		});
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
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
		});
		return (
			<fieldset className={fieldClasses}>
				<legend className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</legend>
				{this.getTabButtons()}
				<div className={styles.tabWrapper}>
					{this.getSelectionTemplate()}
					{this.getManualTemplate()}
				</div>
			</fieldset>
		);
	}
}

PostQuacker.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	depth: PropTypes.number,
	post_type: PropTypes.array,
	strings: PropTypes.object,
	indexMap: PropTypes.array,
	default: PropTypes.object,
	post_id: PropTypes.number,
	editor_settings_reference: PropTypes.string,
	data: PropTypes.object,
	panelIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
	size: PropTypes.string,
};

PostQuacker.defaultProps = {
	label: '',
	name: '',
	description: '',
	depth: 0,
	indexMap: [],
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
