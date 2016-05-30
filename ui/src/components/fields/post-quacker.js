import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import { wpMedia } from '../../globals/wp';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import request from 'superagent';

import MediaUploader from '../shared/media-uploader';
import Button from '../shared/button';
import Notification from '../shared/notification';
import BlankPostUi from '../shared/blank-post-ui';
import PostPreview from '../shared/post-preview';

import RichtextEditor from '../shared/richtext-editor';
import * as RichtextEvents from '../../util/dom/tinymce';
import LinkFieldset from '../shared/link-fieldset';
import ReactSelect from 'react-select-plus';
import objectToParams from '../../util/data/object-to-params';

import styles from './post-quacker.pcss';

const POSTS_SAMPLE = [
	{
		label: 'Post Title',
		value: '11',
	},
	{
		label: 'This is important news',
		value: '12',
	},
	{
		label: 'These are important times',
		value: '13',
	},
];

class PostQuacker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.default.type,
			image: '',
			title: '',
			content: '',
			post_types:[],
			posts:[],
			link_url: '',
			link_label: '',
			link_target: '_blank',
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
	 * Handler for Add to Module button
	 *
	 * @method handleAddToModuleClick
	 */
	@autobind
	handleAddToModuleClick() {
		// add the selected post to this field
	}

	/**
	 * Handler for Remove Post Click
	 *
	 * @method handleRemovePostClick
	 */
	@autobind
	handleRemovePostClick() {
		// add the selected post to this field
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
			const selection = frame.state().get('selection');
			console.log(selection);

			// todo when hooking up store and have current image load selection
		});

		frame.on('select', () => {
			const attachment = frame.state().get('selection').first().toJSON();
			this.setState({ image: attachment.sizes['large'].url });

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
		// code to connect to actions that execute on redux store
		this.setState({
			[event.currentTarget.name]: event.currentTarget.value,
		});
	}

	@autobind
	handlePostTypeChange(types) {
		// code to connect to actions that execute on redux store
		this.setState({
			post_types: types,
		});

	}

	/**
	 * Handler for post select change
	 *
	 * @method handlePostSelectChange
	 */
	@autobind
	handlePostSelectChange() {
		// code to connect to actions that execute on redux store
	}

	getRequestParams(input) {
		return objectToParams({
			action: 'posts-field-posts-search',
			s: input,
			type: 'query-panel',
			paged: 1,
			post_type: this.state.search_post_type,
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
	 * Constructing rich text editor template
	 *
	 * @method getEditorTemplate
	 */

	getEditorTemplate() {
		return (<div
			id={`wp-${this.fid}-wrap`}
			ref={this.fid}
			className="wp-core-ui wp-editor-wrap tmce-active"
		>
			<RichtextEditor fid={this.fid} name="content" buttons={false} value={this.state.content} onChange={this.handleTextChange} />
		</div>);
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
					<LinkFieldset label="Optional: Enter custom URL and target" valueTarget={this.state.link_target} valueUrl={this.state.link_url} valueLabel={this.state.link_label} />
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
						name={`${this.props.name}[filters][post_type][selection][]`}
						value={this.state.post_types}
						multi={true}
						className={typeSelectClasses}
						placeholder="Select Post Types"
						options={this.props.post_type}
						onChange={this.handlePostTypeChange}
					/>
				</div>

				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>Select Content</label>
					<ReactSelect
						disabled={true}
						name=""
						className={typeSelectClasses}
						placeholder="Choose a Post"
						value=""
						options={POSTS_SAMPLE}
						onChange={this.handlePostSelectChange}
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
				<div className={styles.panelFilterRow}>
					<div className={styles.blankPostContainer}>
						<div><BlankPostUi /></div>
					</div>
				</div>
				<div className={styles.panelFilterRow}>
					<PostPreview title="Some Post Title" excerpt="Some excerpt" thumbnail="http://placekitten.com/200/200" onClick={this.handleRemovePostClick} />
				</div>
			</div>
		);
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
		return (
			<fieldset className={styles.field}>
				<legend className={styles.label}>{this.props.label}</legend>
				{this.getTabButtons()}
				<div className={styles.tabWrapper}>
					{this.getSelectionTemplate()}
					{this.getManualTemplate()}
				</div>
				<p className={styles.description}>{this.props.description}</p>
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
};

PostQuacker.defaultProps = {
	label: '',
	name: '',
	description: '',
	post_type: [],
	strings: {},
	default: {},
};

export default PostQuacker;
