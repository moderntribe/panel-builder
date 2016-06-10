import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';
import Sortable from 'react-sortablejs';
import _ from 'lodash';
import request from 'superagent';

import PostListManualTypeChooser from './partials/post-list-manual-type-chooser';
import PostListPostManual from './partials/post-list-post-manual';
import PostListPostSelected from './partials/post-list-post-selected';
import Button from '../shared/button';
import Notification from '../shared/notification';
import PostPreview from '../shared/post-preview';
import PostPreviewContainer from './partials/post-preview-container';

import { POST_LIST_I18N } from '../../globals/i18n';

import styles from './post-list.pcss';

class PostList extends Component {
	state = {
		type: this.props.default.type,
		manual_post_data: [],
		manual_post_count: 0,
		manual_add_count: this.props.min,
	};

	getTabButtons() {
		const manualButtonClasses = classNames({
			'pl-show-manual': true,
			[styles.active]: this.state.type === 'manual',
		});

		const queryButtonClasses = classNames({
			'pl-show-query': true,
			[styles.active]: this.state.type === 'query',
		});

		return (
			<div className={styles.tabs}>
				<Button
					classes={manualButtonClasses}
					text={this.props.strings['tabs.manual']}
					full={false}
					handleClick={this.switchTabs}
				/>
				<Button
					classes={queryButtonClasses}
					text={this.props.strings['tabs.dynamic']}
					full={false}
					handleClick={this.switchTabs}
				/>
			</div>
		);
	}

	getManualNotification() {
		let MaybeNotification = null;

		if (this.state.manual_post_count < this.props.min) {
			const minCount = this.props.min - this.state.manual_post_count;
			const noticeTextString = this.props.min > 1 ?
				POST_LIST_I18N.notification_min_posts_multiple :
				POST_LIST_I18N.notification_min_posts_single;
			const noticeText = noticeTextString.replace('%MIN_COUNT%', `${minCount}`);
			MaybeNotification = (
				<Notification
					text={noticeText}
					type="warn"
				/>
			);
		}

		return MaybeNotification;
	}

	getManualPosts() {
		let Posts = null;
		if (this.state.manual_post_data.length) {
			const Items = _.map(this.state.manual_post_data, (data, i) => {
				let Template;
				if (data.isPreview){
					// send only post id or send full post
					if (data.method=='manual'){
						const fakePost = {
							post_title: data.post_title,
							post_content: data.post_content,
						};
						Template = (
							<PostPreviewContainer
								key={`manual-post-preview-${i}`}
								post={fakePost}
								editableId={data.editableId}
								onRemoveClick={this.handleRemovePostClick}
							/>
						);
					} if (data.method=='select') {
						Template = (
							<PostPreviewContainer
								key={`manual-post-preview-${i}`}
								post_id={data.ID}
								editableId={data.editableId}
								onRemoveClick={this.handleRemovePostClick}
							/>
						);
					}

				} else {
					if (data.type === 'manual') {
						Template = (
							<PostListPostManual
								key={data.editableId}
								editableId={data.editableId}
								strings={this.props.strings}
								postTitle={data.postTitle}
								postContent={data.postContent}
								postUrl={data.postUrl}
								handleCancelClick={this.handleCancelClick}
								handleAddClick={this.handleAddClick}
							/>
						);
					} else {
						Template = (
							<PostListPostSelected
								key={data.editableId}
								editableId={data.editableId}
								strings={this.props.strings}
								post_type={this.props.post_type}
								handleCancelClick={this.handleCancelClick}
								handleAddClick={this.handleAddClick}
							/>
						);
					}
				}


				return Template;
			});
			const options = {
				onSort: (e) => {
					this.handleManualSort(e);
				},
			};
			Posts = (
				<Sortable
					options={options}
				>
					{Items}
				</Sortable>
			);
		}

		return Posts;
	}

	getManualTypeChooser() {
		let MaybeChooser = null;

		if (this.state.manual_post_count < this.props.max) {
			MaybeChooser = _.times(this.state.manual_add_count, (i) =>
				<PostListManualTypeChooser
					key={`add-manual-post-${i}`}
					index={i}
					showHeading={this.state.manual_post_count !== 0}
					handleClick={this.addManualPost}
					strings={this.props.strings}
				/>
			);
			if (this.state.manual_post_count) {
				MaybeChooser = (
					<div>
						<h3>{POST_LIST_I18N.chooser_heading}</h3>
						{MaybeChooser}
					</div>
				);
			}
		}

		return MaybeChooser;
	}

	getManualTemplate() {
		const tabClasses = classNames({
			[styles.tabContent]: true,
			[styles.active]: this.state.type === 'manual',
		});

		return (
			<div className={tabClasses}>
				{this.getManualNotification()}
				{this.getManualPosts()}
				{this.getManualTypeChooser()}
			</div>
		);
	}

	getQueryTemplate() {
		const tabClasses = classNames({
			[styles.tabContent]: true,
			[styles.active]: this.state.type === 'query',
		});

		return (
			<div className={tabClasses}>
				<ReactSelect
					options={this.props.filters}
					onChange={this.handleChange}
				/>
			</div>
		);
	}

	removePostFromList(editableId) {
		// looking for editableId
		const newState = {};
		newState.manual_post_count = this.state.manual_post_count;
		newState.manual_post_count--;
		if (this.state.manual_add_count < this.props.max) {
			newState.manual_add_count = this.state.manual_add_count;
			newState.manual_add_count++;
		}
		newState.manual_post_data = this.state.manual_post_data;
		_.remove(newState.manual_post_data, function(n) {
			return n.editableId == editableId;
		});
		this.setState(newState);
	}

	@autobind
	handleManualSort(data) {
	}

	@autobind
	addManualPost(e) {
		const newState = {};
		const type = e.currentTarget.classList.contains('type-manual') ? 'manual' : 'select';
		const editableId = _.uniqueId('post-editable-');

		if (this.state.manual_add_count > 1) {
			newState.manual_add_count = this.state.manual_add_count;
			newState.manual_add_count--;
		}

		newState.manual_post_count = this.state.manual_post_count;
		newState.manual_post_count++;

		newState.manual_post_data = this.state.manual_post_data;
		newState.manual_post_data.push({
			type,
			editableId,
		});

		this.props.updateHeights();

		this.setState(newState);
	}

	@autobind
	handleCancelClick(e) {
		// looking for editableId
		this.removePostFromList(e.state.editableId);
	}

	@autobind
	handleRemovePostClick(e) {
		this.removePostFromList(e.state.editableId)
	}

	@autobind
	handleAddClick(e) {
		const newState = {};
		newState.manual_post_data = _.map(this.state.manual_post_data, (data, i) => {
			if (data.editableId === e.state.editableId ){
				data.post_title = e.state.postTitle;
				data.post_content = e.state.postContent;
				data.url = e.state.postUrl;
				data.ID = e.state.search;
				data.isPreview = true;
				data.method = e.state.method;
			}
			return data;
		});
		this.setState(newState);
	}

	@autobind
	switchTabs(e) {
		const type = e.currentTarget.classList.contains('pl-show-manual') ? 'manual' : 'query';
		this.setState({ type });
	}

	@autobind
	handleChange() {
		// code to connect to actions that execute on redux store
	}

	render() {
		return (
			<div className={styles.field}>
				<legend className={styles.label}>{this.props.label}</legend>
				{this.getTabButtons()}
				<div className={styles.tabWrapper}>
					{this.getManualTemplate()}
					{this.getQueryTemplate()}
				</div>
				<p className={styles.description}>{this.props.description}</p>
			</div>
		);
	}
}

PostList.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.object,
	default: PropTypes.object,
	min: PropTypes.number,
	max: PropTypes.number,
	suggested: PropTypes.number,
	show_max_control: PropTypes.bool,
	post_type: PropTypes.array,
	filters: PropTypes.array,
	taxonomies: PropTypes.object,
	updateHeights: PropTypes.func,
};

PostList.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: {},
	default: {},
	min: 1,
	max: 12,
	suggested: 6,
	show_max_control: false,
	post_type: [],
	filters: [],
	taxonomies: {},
	updateHeights: () => {},
};

export default PostList;
