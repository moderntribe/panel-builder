import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';
import Sortable from 'react-sortablejs';
import _ from 'lodash';
import request from 'superagent';
import param from 'jquery-param';

import PostListManualTypeChooser from './partials/post-list-manual-type-chooser';
import PostListPostManual from './partials/post-list-post-manual';
import PostListPostSelected from './partials/post-list-post-selected';
import Button from '../shared/button';
import Notification from '../shared/notification';
import PostPreviewContainer from '../shared/post-preview-container';
import PostListQueryTagFilter from './partials/post-list-query-tag-filter';
import PostListQueryDateFilter from './partials/post-list-query-date-filter';
import PostListQueryRelatedFilter from './partials/post-list-query-related-filter';
import * as AdminCache from '../../util/data/admin-cache';

import { POST_LIST_I18N } from '../../globals/i18n';

import styles from './post-list.pcss';

class PostList extends Component {
	state = {
		type: this.props.default.type,
		manual_post_data: [],
		manual_post_count: 0,
		manual_add_count: this.props.min,
		query_posts: {},   // post objects
		post_types: [],
		tagsFilterActive: false,
		dateFilterActive: false,
		relatedPostsFilterActive: false,
		dateFilterStartDate: null,
		dateFilterEndDate: null,
		relatedPostsFilterPostTypes: [],
		tagsFilterPostTags: [],
		filterValue: '',
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

	getFilters() {
		const filterClasses = classNames({
			[styles.filter]: true,
			'query-filters': true,
		});
		let RelatedFilter;
		if (this.state.relatedPostsFilterActive ){
			const postType = _.find(this.props.filters, { 'value': 'related_posts'}).post_type; // { "page": "Page"...}
			const keys = _.keysIn(postType); // ["page", "posts"...]
			const postTypesArray = _.map(keys, (key) => {
				return {
					value: key,
					label: postType[key],
				};
			}); // array of value and labels for select
			RelatedFilter = (<PostListQueryRelatedFilter postTypes={postTypesArray} onChangeRelatedPosts={this.onChangeRelatedPosts} onRemoveClick={this.onRemoveRelatedPostsFilter} />);
		}
		return (
			<div className={filterClasses}>
				{this.state.tagsFilterActive && <PostListQueryTagFilter onChangeTag={this.onChangeTag} options={this.props.taxonomies.post_tag} onRemoveClick={this.onRemoveTagFilter} />}
				{this.state.dateFilterActive && <PostListQueryDateFilter onChangeDate={this.onChangeDate} onRemoveClick={this.onRemoveDateFilter} />}
				{RelatedFilter}
			</div>
		);
	}

	getFilteredPosts() {
		const keys = _.keys(this.state.query_posts);
		const posts = _.map(keys, (key, i) => {
			return (
				<PostPreviewContainer
					key={`query-post-preview-${key}`}
					post={this.state.query_posts[key]}
				/>
			);
		});
		return (
			<div>
				{posts}
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
				<div className={styles.row}>
					<label className={styles.tabLabel}>{this.props.strings['label.content_type']}</label>
					<ReactSelect
						options={this.props.post_type}
						name={_.uniqueId('post-list-type-')}
						placeholder="Select Post Types"
						multi
						value={this.state.post_types}
						onChange={this.handlePostTypeChange}
					/>
				</div>

				<div className={styles.row}>
					<ReactSelect
						options={this.props.filters}
						name={_.uniqueId('post-list-filter-')}
						onChange={this.handleFilterChange}
						value={this.state.filterValue}
						placeholder="Add A Filter"
					/>
				</div>

				{this.getFilters()}
				{this.getFilteredPosts()}

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
		this.removePostFromList(e.state.editableId);
	}

	@autobind
	handleAddClick(e) {
		const newState = {};
		newState.manual_post_data = _.map(this.state.manual_post_data, (data) => {
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
	onChangeTag(e) {
		const tagsFilterPostTags = e.state.tags;
		this.setState({
			tagsFilterPostTags,
		},() => {
			this.getNewPosts();
		});
	}

	@autobind
	onChangeDate(e) {
		const dateFilterStartDate = e.state.startDate;
		const dateFilterEndDate = e.state.endDate;
		this.setState({
			dateFilterStartDate,
			dateFilterEndDate,
		},() => {
			this.getNewPosts();
		});
	}

	@autobind
	onChangeRelatedPosts(e) {
		const relatedPostsFilterPostTypes = e.state.postTypes;
		this.setState({
			relatedPostsFilterPostTypes
		},() => {
			this.getNewPosts();
		});
	}

	@autobind
	onRemoveRelatedPostsFilter(e) {
		this.setState({
			filterValue: '',
			relatedPostsFilterActive: false,
			relatedPostsFilterPostTypes: [],
		},() => {
			this.getNewPosts();
		})
	}

	@autobind
	onRemoveDateFilter() {
		this.setState({
			filterValue: '',
			dateFilterActive: false,
			dateFilterStartDate: null,
			dateFilterEndDate: null,
		},() => {
			this.getNewPosts();
		})
	}

	@autobind
	onRemoveTagFilter() {
		this.setState({
			filterValue: '',
			tagsFilterActive: false,
			tagsFilterPostTags: [],
		},() => {
			this.getNewPosts();
		})
	}

	@autobind
	handleFilterChange(e) {
		if (e && e.value){
			if (e.value === 'post_tag') {
				this.setState({
					filterValue: e.value,
					tagsFilterActive:true,
				});
			} else if (e.value === 'date') {
				this.setState({
					filterValue: e.value,
					dateFilterActive:true,
				})
			} else if (e.value === 'related_posts') {
				this.setState({
					filterValue: e.value,
					relatedPostsFilterActive:true,
				});
			}
		} else {
			this.setState({
				filterValue: '',
			});
		}
	}

	@autobind
	handlePostTypeChange(types) {
		if (types){
			this.setState({
				post_types: types,
			},() => {
				this.getNewPosts();
			});
		} else {
			this.setState({
				post_types: [],
			},() => {
				this.getNewPosts();
			});
		}
	}

	/**
	 * Get search params for posts limited by type
	 *
	 * @method getSearchRequestParams
	 */
	getSearchRequestParams() {
		const types = [];
		_.forEach(this.state.post_types, (type) => {
			types.push(type.value);
		});
		return param({
			action: 'posts-field-posts-search',
			s: '',
			type: 'query-panel',
			paged: 1,
			post_type: types,
			field_name: 'items',
		});
	}

	/**
	 * Get preview params for posts
	 *
	 * @method getSearchRequestParams
	 */
	getPreviewRequestParams() {
		let filters = {};
		const types = [];
		_.forEach(this.state.post_types, (type) => {
			types.push(type.value);
		});
		// post types
		if (this.state.post_types.length) {
			filters.post_type = {
				selection:types,
				lock:true,
			};
		}
		// add the date
		if (this.state.dateFilterStartDate || this.state.dateFilterEndDate) {
			filters.date = {
				lock: true,
				selection: {},
			};
			// assumes these are moment dates
			if (this.state.dateFilterStartDate) {
				filters.date.selection.start = this.state.dateFilterStartDate.format('YYYY-MM-DD');
			}
			if (this.state.dateFilterEndDate){
				filters.date.selection.end = this.state.dateFilterEndDate.format('YYYY-MM-DD');
			}
		}
		// post tags tagsFilterPostTags
		if (this.state.tagsFilterPostTags.length) {
			// build simple array of post type ids
			const selection = _.map(this.state.tagsFilterPostTags, 'value');
			filters.post_tag = {
				lock: true,
				selection,
			};
		}
		// related posts filter
		if (this.state.relatedPostsFilterPostTypes.length) {
			// build simple array of post type ids
			const selection = _.map(this.state.relatedPostsFilterPostTypes, 'value');
			filters.related_posts = {
				lock: true,
				selection,
			};
		}
		return param({
			action: 'posts-field-fetch-preview',
			filters,
			max:this.props.max,
			context:1,
		});

	}

	getNewPosts(){
		if (!this.state.post_types.length) {
			return;
		}
		const params = this.getPreviewRequestParams();
		const ajaxURL = window.ajaxurl;
		request.post(ajaxURL)
			.send(params)
			.end((err, response) => {
				if (response.ok) {
					// is returned in posts object with key and values (post ID and post obj)
					// add to cache
					AdminCache.addPosts(response.body.data.posts);
					this.setState({
						query_posts: response.body.data.posts,
					});
				}
			});
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
