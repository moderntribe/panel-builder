import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import Polyglot from 'node-polyglot';
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
import PostListQueryTaxonomyFilter from './partials/post-list-query-taxonomy-filter';
import PostListQueryDateFilter from './partials/post-list-query-date-filter';
import PostListQueryRelatedFilter from './partials/post-list-query-related-filter';
import * as AdminCache from '../../util/data/admin-cache';

import styles from './post-list.pcss';

import { POST_LIST_CONFIG } from '../../globals/config';

class PostList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.data.type ? this.props.data.type : this.props.default.type,
			manualPostData: this.props.data.posts ? this.prepIncomingPosts(this.props.data.posts) : [],
			queryPosts: {},   // filtered lists... coming from ajax call not props.data
			postTypes: this.prepIncomingPostTypes(),
			filters: this.prepIncomingFilters(),
			filterValue: '',
		};
	}

	componentWillMount() {
		if (this.state.filters.length){
			this.getNewPosts();
		}
	}

	/**
	 *  Prepares the filters to use as a state variable.
	 *
	 * @method prepIncomingFilters
	 */
	prepIncomingFilters() {
		let filters = [];
		const filterKeys = _.keys(this.props.data.filters);
		filterKeys.forEach((filterKey) => {
			if (filterKey !== 'post_type') {
				const filterProps = this.getPropFilterByKey(filterKey);
				const filterData = this.props.data.filters[filterKey];
				if (filterProps && filterData){
					filters.push({
						filter_type: filterProps.filter_type,
						filterID: _.uniqueId('post-list-filter'),
						selection: filterData.selection,
						post_type: filterProps.post_type,
						value: filterProps.value,
						label: filterProps.label,
					});
				} else {
					console.log("No filter was found for that filter key :" + filterKey);
				}
			}
		});
		return filters;
	}

	/**
	 *  Get the filter details from the property based on a key.
	 *
	 * @method getPropFilterByKey
	 */
	getPropFilterByKey(filterKey) {
		for (const filter of this.props.filters) {
			if (filter.value){
				if (filter.value === filterKey){
					return filter;
				}
			} else if (filter.options) {
				for (const option of filter.options) {
					if (option.value === filterKey){
						return option;
					}
				}
			}
		}
		return null;
	}

	/**
	 *  Prepare the post types for the state. Build array of post type label/value
	 *
	 * @method prepIncomingPostTypes
	 */
	prepIncomingPostTypes() {
		let postTypes = [];
		if (this.props.data.filters && this.props.data.filters.post_type){
			const arrTypes = this.props.data.filters.post_type.selection;
			this.props.post_type.forEach((postType) => {
				arrTypes.forEach((type) => {
					if (postType.value === type){
						postTypes.push(postType);
					}
				});
			});
		}
		return postTypes;
	}

	/**
	 *  Adds editableID and isPreview to incoming data so we can manage it in react
	 *
	 * @method prepIncomingPosts
	 */
	prepIncomingPosts(posts) {
		posts.forEach((post) => {
			post.editableId = _.uniqueId('post-editable-');
			post.isPreview = true;
		});
		return posts;
	}

	/**
	 *  Maps real wp post data to the data format we're using for BE post
	 *
	 * @method mapWPPostToDataPost
	 */
	mapWPPostToDataPost(wpPost) {
		return {
			post_title: wpPost.post_title,
			post_content: wpPost.post_excerpt,
			url: wpPost.permalink,
			id: wpPost.ID.toString(),
		}
	}

	/**
	 *  Maps our post data to WP post format
	 *
	 * @method mapDataPostToWPPost
	 */
	mapDataPostToWPPost(post) {
		return {
			post_title: post.post_title,
			post_excerpt: post.post_content,
			permalink: post.url,
			ID: parseInt(post.id),
		}
	}

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
		if (this.state.manualPostData.length < this.props.min) {
			const requiredCount = this.props.min - this.state.manualPostData.length;
			const polyglot = new Polyglot();
			polyglot.extend({
				min_posts_notice: this.props.strings['notice.min_posts'],
			});
			const noticeText = polyglot.t('min_posts_notice', { count: requiredCount, smart_count: requiredCount });
			MaybeNotification = (
				<Notification
					text={noticeText}
					type="warn"
				/>
			);
		}

		return MaybeNotification;
	}

	/**
	 *  Prints out the list of post in either preview format or edit format
	 *
	 * @method getManualPosts
	 */
	getManualPosts() {
		let Posts = null;
		if (this.state.manualPostData.length) {
			const Items = _.map(this.state.manualPostData, (data, i) => {
				let Template;
				if (data.isPreview){
					// send only post id or send full post
					if (data.method===POST_LIST_CONFIG.POST_METHODS.Manual){
						const post = this.mapDataPostToWPPost(data);
						Template = (
							<PostPreviewContainer
								key={_.uniqueId('manual-post-preview-')}
								post={post}
								editableId={data.editableId}
								onRemoveClick={this.handleRemovePostClick}
								onEditClick={this.handleEditPostClick}
							/>
						);
					} if (data.method===POST_LIST_CONFIG.POST_METHODS.Select) {
						Template = (
							<PostPreviewContainer
								key={_.uniqueId('manual-post-preview-')}
								post_id={data.id}
								editableId={data.editableId}
								onRemoveClick={this.handleRemovePostClick}
								onGetPostDetails={this.handleGetPostDetails}
							/>
						);
					}
				} else {
					if (data.method===POST_LIST_CONFIG.POST_METHODS.Manual) {
						Template = (
							<PostListPostManual
								key={_.uniqueId('manual-post-edit-')}
								editableId={data.editableId}
								strings={this.props.strings}
								postTitle={data.post_title}
								postContent={data.post_content}
								postUrl={data.url}
								handleCancelClick={this.handleCancelClick}
								handleAddClick={this.handleAddUpdateClick}
							/>
						);
					} else if (data.method===POST_LIST_CONFIG.POST_METHODS.Select) {
						Template = (
							<PostListPostSelected
								key={_.uniqueId('manual-post-edit-')}
								editableId={data.editableId}
								strings={this.props.strings}
								post_type={this.props.post_type}
								handleCancelClick={this.handleCancelClick}
								handleAddClick={this.handleAddUpdateClick}
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


	/**
	 * Add extra empty items if less than min
	 *
	 * @method getManualTypeChooser
	 */
	getManualTypeChooser() {
		let MaybeChooser = null;
		// Shows the empties if less than min
		if (this.state.manualPostData.length < this.props.min) {
			const remaining = this.props.min - this.state.manualPostData.length
			MaybeChooser = _.times(remaining, (i) =>
				<PostListManualTypeChooser
					key={_.uniqueId('add-manual-post-')}
					index={i}
					showHeading={this.state.manualPostData.length !== 0}
					handleClick={this.addManualPost}
					strings={this.props.strings}
				/>
			);
		} else if (this.state.manualPostData.length < this.props.max ) {
			// shows one empty if more than min but less than max
			MaybeChooser = (<div>
				<PostListManualTypeChooser
				key={_.uniqueId('add-manual-post-')}
				index={0}
				showHeading={this.state.manualPostData.length !== 0}
				handleClick={this.addManualPost}
				strings={this.props.strings}
			/>
			</div>);
		}
		return MaybeChooser;
	}

	/**
	 * Tab for Manual
	 *
	 * @method getManualTemplate
	 */
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

	/**
	 * Build out filters
	 *
	 * @method getFilters
	 */
	getFilters() {
		const filterClasses = classNames({
			[styles.filter]: true,
			'query-filters': true,
		});

		// map filter data to individual filters
		let Filters = _.map(this.state.filters, (filter) => {
			if (filter.filter_type===POST_LIST_CONFIG.FILTERS.Date){
				return (
					<PostListQueryDateFilter key={filter.filterID} filterID={filter.filterID} selection={filter.selection} label={filter.label} onChangeDate={this.onChangeFilterGeneric} onRemoveClick={this.onRemoveFilter} />
				);
			} else if (filter.filter_type===POST_LIST_CONFIG.FILTERS.Taxonomy) {
				const taxonomy = this.props.taxonomies[filter.value];
				return (
					<PostListQueryTaxonomyFilter key={filter.filterID} filterID={filter.filterID} label={filter.label} onChangeTaxonomy={this.onChangeFilterGeneric} options={taxonomy} onRemoveClick={this.onRemoveFilter} />
				);
			} else if (filter.filter_type===POST_LIST_CONFIG.FILTERS.P2P) {
				const postTypesArray = _.map(filter.post_type, (key, value) => {
					return {
						value: value,
						label: key,
					};
				});
				return (
					<PostListQueryRelatedFilter key={filter.filterID} filterID={filter.filterID} postTypes={postTypesArray} label={filter.label} onChangeRelatedPosts={this.onChangeFilterGeneric} onRemoveClick={this.onRemoveFilter} />
				);
			}
		});

		return (
			<div className={filterClasses}>
				{Filters}
			</div>
		);
	}

	/**
	 * Build out posts to display
	 *
	 * @method getFilteredPosts
	 */
	getFilteredPosts() {
		const keys = _.keys(this.state.queryPosts);
		const posts = _.map(keys, (key, i) => {
			return (
				<PostPreviewContainer
					key={_.uniqueId('query-post-preview-')}
					post={this.state.queryPosts[key]}
				/>
			);
		});
		return (
			<div>
				{posts}
			</div>
		);
	}


	/**
	 * Builds the options for the filter select. Gets updated whenever post types changes
	 * Handles several layers of filter removal
	 * 1. top level containing array of post_type
	 * 2. second level options containing array of post_type
	 * 3. second level options containing post_type object with keys
	 *
	 * @method getFilterOptions
	 */
	getFilterOptions() {
		let filters = _.cloneDeep(this.props.filters);
		let postTypesFlat = _.map(this.state.postTypes, (type) => {
			return type.value;
		});

		// first level for date
		filters = _.remove(filters, (filter) => {
			if (!filter.post_type) {
				return true;
			} else {
				const intersect = _.intersection(filter.post_type, postTypesFlat);
				return intersect.length > 0;
			}
		});

		// second level
		filters.forEach((filter) => {
			if (filter.options) {
				// if array
				if (filter.options.length){
					// if array
					let optionsFiltered = _.remove(filter.options, (option) => {
						if (!option.post_type){
							return true; // remove if no post_type
						} else {
							if (option.post_type.length){ // check against array
								const intersect = _.intersection(option.post_type, postTypesFlat);
								return intersect.length > 0;
							} else { // check against object and keys
								const keysIn = _.keysIn(option.post_type);
								const intersectKeys = _.intersection(keysIn, postTypesFlat);
								return intersectKeys.length > 0;
							}
						}
					});
					filter.options = optionsFiltered;
				}
			}
		});
		return filters;
	}

	/**
	 * Build the Query tab template
	 *
	 * @method getQueryTemplate
	 */
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
						value={this.state.postTypes}
						onChange={this.handlePostTypeChange}
					/>
				</div>

				<div className={styles.row}>
					<ReactSelect
						options={this.getFilterOptions()}
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

	editPostFromList(editableId) {
		// flag specific item as in preview state
		let manualPostData = _.cloneDeep(this.state.manualPostData);
		manualPostData.forEach((post) => {
			if (editableId === post.editableId){
				post.isPreview = false;
			}
		});
		this.setState({
			manualPostData,
		});
	}

	/**
	 * Remove a post from the manual post list based on an editable ID
	 *
	 * @method removePostFromList
	 */
	removePostFromList(editableId) {
		// looking for editableId
		const newState = {};
		newState.manualPostData = _.cloneDeep(this.state.manualPostData);
		_.remove(newState.manualPostData, function(n) {
			return n.editableId == editableId;
		});
		this.setState(newState);
	}

	@autobind
	handleManualSort(data) {
	}

	/**
	 * Adds edit post item to the list. Either manual or select
	 *
	 * @method addManualPost
	 */
	@autobind
	addManualPost(e) {
		const newState = {};
		const method = e.currentTarget.classList.contains('type-manual') ? POST_LIST_CONFIG.POST_METHODS.Manual : POST_LIST_CONFIG.POST_METHODS.Select;
		const editableId = _.uniqueId('post-editable-');
		newState.manualPostData = _.cloneDeep(this.state.manualPostData);
		newState.manualPostData.push({
			method,
			editableId,
		});
		this.setState(newState);
	}

	/**
	 * After post preview retrieves details
	 *
	 * @method handleGetPostDetails
	 */
	@autobind
	handleGetPostDetails(e) {
		const newPost = this.mapWPPostToDataPost(e.state.post);
		// update date related to this.
		this.state.manualPostData.forEach((post) => {
			if (post.editableId == e.editableId){
				post = _.extend(post, newPost)
			}
		});
	}

	@autobind
	handleCancelClick(e) {
		// looking for editableId
		this.removePostFromList(e.state.editableId);
	}

	@autobind
	handleRemovePostClick(e) {
		this.removePostFromList(e.editableId);
	}

	@autobind
	handleEditPostClick(e) {
		this.editPostFromList(e.state.editableId);
	}

	/**
	 * Add item in edit mode to the list.
	 *
	 * @method handleAddUpdateClick
	 */
	@autobind
	handleAddUpdateClick(e) {
		const newState = {};
		newState.manualPostData = _.map(this.state.manualPostData, (data) => {
			if (data.editableId === e.state.editableId ){
				// adding either a manual item or a select
				if (data.method === POST_LIST_CONFIG.POST_METHODS.Manual){
					data.post_title = e.state.postTitle;
					data.post_content = e.state.postContent;
					data.url = e.state.postUrl;
					data.id = '';
				} else if (data.method === POST_LIST_CONFIG.POST_METHODS.Select){
					// only have id at this point... uses preview to retrieve the post data
					data.id = e.state.search;
				}
				data.isPreview = true;
			}
			return data;
		});
		this.setState(newState);
	}

	/**
	 * Switch handle handler
	 *
	 * @method switchTabs
	 */
	@autobind
	switchTabs(e) {
		const type = e.currentTarget.classList.contains('pl-show-manual') ? 'manual' : 'query';
		this.setState({ type });
	}

	/**
	 * Update filter in state from date, related content or taxonomy filter
	 *
	 * @method onChangeFilterGeneric
	 */
	@autobind
	onChangeFilterGeneric(e) {
		let filters = this.state.filters;
		filters.forEach((filter) => {
			if (filter.filterID == e.filterID){
				filter.selection = e.selection;
			}
		});
		this.setState({
			filters
		},() => {
			this.getNewPosts();
		});
	}

	/**
	 * Handle date filter removal
	 *
	 * @method onRemoveDateFilter
	 */
	@autobind
	onRemoveFilter(e) {
		let filters = _.cloneDeep(this.state.filters);
		_.remove(filters, (filter) => {
			return filter.filterID === e.filterID;
		});
		this.setState({
			filterValue: '',
			filters,
		},() => {
			this.getNewPosts();
		});
	}


	/**
	 * Handle filter chamge
	 *
	 * @method handleFilterChange
	 */
	@autobind
	handleFilterChange(e) {
		// add new filter of the new type
		if (e && e.value){
			const filterID = _.uniqueId('filter-id-');
			let filters = _.cloneDeep(this.state.filters);
			filters.push(_.assignIn(e, {filterID}));
			this.setState({
				filterValue: e.value,
				filters,
			});
		}
	}

	/**
	 * Handle post type change
	 *
	 * @method handlePostTypeChange
	 */
	@autobind
	handlePostTypeChange(types) {
		if (types){
			this.setState({
				postTypes: types,
			},() => {
				this.getNewPosts();
			});
		} else {
			this.setState({
				postTypes: [],
			},() => {
				this.getNewPosts();
			});
		}
	}

	/**
	 * Get preview params for posts.
	 *
	 * @method getPreviewRequestParams
	 */
	getPreviewRequestParams() {
		let filters = {};
		const types = [];
		_.forEach(this.state.postTypes, (type) => {
			types.push(type.value);
		});
		// post types
		if (this.state.postTypes.length) {
			filters.post_type = {
				selection:types,
				lock:true,
			};
		}
		// filters
		this.state.filters.forEach((filter) => {
			filters[filter.value] = {
				lock: true,
				selection: filter.selection,
			}
		});

		return param({
			action: 'posts-field-fetch-preview',
			filters,
			max:this.props.max,
			context:1,
		});

	}

	/**
	 * Retrieve new posts. Add to cache
	 *
	 * @method getNewPosts
	 */
	getNewPosts(){
		if (!this.state.postTypes.length) {
			return;
		}
		const params = this.getPreviewRequestParams();
		const ajaxURL = window.ajaxurl;
		request.post(ajaxURL)
			.send(params)
			.end((err, response) => {
				if (response && response.ok) {
					AdminCache.addPosts(response.body.data.posts);
					this.setState({
						queryPosts: response.body.data.posts,
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
	data: PropTypes.object,
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
	data: {},
	show_max_control: false,
	post_type: [],
	filters: [],
	taxonomies: {},
	updateHeights: () => {},
};

export default PostList;
