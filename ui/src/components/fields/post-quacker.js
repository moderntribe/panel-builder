import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { wpMedia } from '../../globals/wp';

import MediaUploader from '../shared/media-uploader';
import Button from '../shared/button';
import Notification from '../shared/notification';

import ReactSelect from 'react-select-plus';

import styles from './post-quacker.pcss';

const POST_TYPES = [
	{
		label: 'Article',
		value: 'article',
	},
	{
		label: 'Products',
		value: 'products',
	},
	{
		label: 'Carousel Item',
		value: 'carousel-item',
	},
];
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
			image:'',
		};
		this.handleChange = this.handleChange.bind(this);
		this.switchTabs = this.switchTabs.bind(this);
		this.handlePostTypeSelectChange = this.handlePostTypeSelectChange.bind(this);
		this.handlePostTypeSelectChange = this.handlePostTypeSelectChange.bind(this);
		this.handlePostSelectChange = this.handlePostSelectChange.bind(this);

		// manual
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleAddMedia = this.handleAddMedia.bind(this);
		this.handleRemoveMedia = this.handleRemoveMedia.bind(this);

	}

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
			console.log("frame",frame)
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

	handleRemoveMedia() {
		this.setState({ image: '' });
	}

	handleChange() {
		// code to connect to actions that execute on redux store
	}

	handlePostTypeSelectChange() {
		// code to connect to actions that execute on redux store
	}

	handlePostSelectChange() {
		// code to connect to actions that execute on redux store
	}

	handleTitleChange() {
		// code to connect to actions that execute on redux store
	}

	switchTabs(e) {
		const type = e.currentTarget.classList.contains('pq-show-manual') ? 'manual' : 'selection';
		this.setState({ type });
	}

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

	getManualTemplate() {
		const tabClasses = classNames({
			[styles.tabContent]: true,
			[styles.active]: this.state.type === 'manual',
		});

		return (
			<div className={tabClasses}>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>Title</label>
					<input type="text" name={`${this.props.name}.title`} value="" size="40" onChange={this.handleChange} />
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

			</div>
		);
	}

	getSelectionTemplate() {
		const tabClasses = classNames({
			[styles.tabContent]: true,
			[styles.active]: this.state.type === 'selection',
		});

		return (
			<div className={tabClasses}>
				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>Content Type</label>
					<ReactSelect
						name={`${this.props.name}[filters][post_type][selection][]`}
						value=""
						placeholder="Select Post Types"
						options={POST_TYPES}
						onChange={this.handlePostTypeChange}
					/>
				</div>

				<div className={styles.panelFilterRow}>
					<label className={styles.tabLabel}>Select Content</label>
					<ReactSelect
						disabled={true}
						name=""
						placeholder="Choose a Post"
						value=""
						options={POSTS_SAMPLE}
						onChange={this.handlePostSelectChange}
					/>
				</div>

			</div>
		);
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
	strings: PropTypes.object,
	default: PropTypes.object,

};

PostQuacker.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: {},
	default: {},
};

export default PostQuacker;
