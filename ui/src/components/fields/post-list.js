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
import PostListQueryTaxonomyFilter from './partials/post-list-query-taxonomy-filter';
import PostListQueryDateFilter from './partials/post-list-query-date-filter';
import PostListQueryRelatedFilter from './partials/post-list-query-related-filter';
import PostListQueryGeneralFilter from './partials/post-list-query-general-filter';
import PostListMaxChooser from './partials/post-list-max-chooser';
import Button from '../shared/button';
import Notification from '../shared/notification';
import PostPreviewContainer from '../shared/post-preview-container';
import * as AdminCache from '../../util/data/admin-cache';
import * as tools from '../../util/dom/tools';

import styles from './post-list.pcss';

import { POST_LIST_CONFIG } from '../../globals/config';

class PostList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			type: this.props.data.type,
			manualPostData: this.props.data.posts ? this.prepIncomingPosts(this.props.data.posts) : [],
			queryPosts: {},   // filtered lists... coming from ajax call not props.data
			postTypes: this.prepIncomingPostTypes(),
			filters: this.prepIncomingFilters(),
			filterValue: '',
			max: Math.max(1, this.props.data.max ? parseInt(this.props.data.max, 10) : this.props.suggested),		// assume a string
		};
	}

	componentWillMount() {
		if (this.state.filters.length || this.state.postTypes.length) {
			this.getNewPosts();
		}
	}

	/**
	 * Update filter in state from date, related content or taxonomy filter
	 *
	 * @method onChangeFilterGeneric
	 */
	@autobind
	onChangeFilterGeneric(e) {
		const filters = this.state.filters;
		filters.forEach((filter) => {
			if (filter.filterID === e.filterID) {
				filter.selection = e.selection; // eslint-disable-line no-param-reassign
			}
		});
		this.setState({
			filters,
		}, () => {
			this.getNewPosts();
			this.initiateUpdatePanelData();
		});
	}

	/**
	 * Handle date filter removal
	 *
	 * @method onRemoveDateFilter
	 */
	@autobind
	onRemoveFilter(e) {
		const filters = _.cloneDeep(this.state.filters);
		_.remove(filters, filter => filter.filterID === e.filterID);
		this.setState({
			filterValue: '',
			filters,
		}, () => {
			this.getNewPosts();
			this.initiateUpdatePanelData();
		});
	}

	/**
	 *  Extracting value before calling panel data update
	 *  Post type, filters, posts, max, etc
	 *
	 * @method getValue
	 */
	getValue() {
		const filters = {};
		// add the post types
		if (this.state.postTypes.length) {
			const selection = _.map(this.state.postTypes, postType => postType.value);
			filters.post_type = {
				selection,
			};
		}
		// add other filters
		for (const filter of this.state.filters) { // eslint-disable-line
			filters[filter.value] = {
				lock: true,
				selection: filter.selection,
			};
		}
		return {
			filters,
			type: this.state.type,
			posts: this.state.manualPostData,
			max: this.state.max.toString(),
		};
	}

	/**
	 *  Get the filter details from the property based on a key.
	 *
	 * @method getPropFilterByKey
	 */
	getPropFilterByKey(filterKey) {
		for (const filter of this.props.filters) { // eslint-disable-line
			if (filter.value) {
				if (filter.value === filterKey) {
					return filter;
				}
			} else if (filter.options) {
				for (const option of filter.options) { // eslint-disable-line
					if (option.value === filterKey) {
						return option;
					}
				}
			}
		}
		return null;
	}

	/**
	 * Render the tab buttons
	 *
	 * @method getTabButtons
	 */
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

	/**
	 * Render the notification saying if the minimum post number has been met. Works for manual posts only
	 *
	 * @method getManualNotification
	 */
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
			const Items = _.map(this.state.manualPostData, (data) => {
				let Template;
				if (data.isPreview) {
					// send only post id or send full post
					if (data.method === POST_LIST_CONFIG.POST_METHODS.Manual) {
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
					}
					if (data.method === POST_LIST_CONFIG.POST_METHODS.Select) {
						if (data.id) {
							Template = (
								<PostPreviewContainer
									key={_.uniqueId('manual-post-preview-')}
									post_id={data.id.toString()}
									post_type={data.post_type}
									editableId={data.editableId}
									onRemoveClick={this.handleRemovePostClick}
									onGetPostDetails={this.handleGetPostDetails}
								/>
							);
						} else {
							// a post was never selected
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
				} else if (data.method === POST_LIST_CONFIG.POST_METHODS.Manual) {
					Template = (
						<PostListPostManual
							key={_.uniqueId('manual-post-edit-')}
							editableId={data.editableId}
							strings={this.props.strings}
							hiddenFields={this.props.hidden_fields}
							postTitle={data.post_title}
							postContent={data.post_content}
							imageId={parseInt(data.thumbnail_id, 10)}
							postUrl={data.url}
							handleCancelClick={this.handleCancelClick}
							handleAddClick={this.handleAddUpdateClick}
						/>
						);
				} else if (data.method === POST_LIST_CONFIG.POST_METHODS.Select) {
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
				return Template;
			});
			const options = {
				filter: '.panel-builder__input--no-drag',
				preventOnFilter: false,
				onSort: (e) => {
					this.handleManualSort(e);
				},
			};

			// todo, sort the sort issues in this field. works fine all browsers except ie11, including edge
			if (tools.browser() === 'ie') {
				Posts = (
					<div>{Items}</div>
				);
			} else {
				Posts = (
					<Sortable options={options}>{Items}</Sortable>
				);
			}
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
			const remaining = this.props.min - this.state.manualPostData.length;
			MaybeChooser = _.times(remaining, i =>
				<PostListManualTypeChooser
					key={_.uniqueId('add-manual-post-')}
					index={i}
					showHeading={this.state.manualPostData.length !== 0}
					handleClick={this.addManualPost}
					strings={this.props.strings}
				/>,
			);
		} else if (this.state.manualPostData.length < this.props.max) {
			// shows one empty if more than min but less than max
			MaybeChooser = (
				<div>
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
		const filtersClasses = classNames({
			[styles.filters]: true,
			'query-filters': true,
		});

		// map filter data to individual filters
		const Filters = _.map(this.state.filters, (filter) => {
			let Template;
			if (filter.filter_type === POST_LIST_CONFIG.FILTERS.Date) {
				Template = (
					<PostListQueryDateFilter
						key={filter.filterID}
						filterID={filter.filterID}
						selection={filter.selection}
						label={filter.label}
						onChangeDate={this.onChangeFilterGeneric}
						onRemoveClick={this.onRemoveFilter}
						strings={this.props.strings}
					/>
				);
			} else if (filter.filter_type === POST_LIST_CONFIG.FILTERS.Taxonomy) {
				const taxonomy = this.props.taxonomies[filter.value];
				Template = (
					<PostListQueryTaxonomyFilter
						key={filter.filterID}
						filterID={filter.filterID}
						label={filter.label}
						onChangeTaxonomy={this.onChangeFilterGeneric} options={taxonomy}
						onRemoveClick={this.onRemoveFilter} selection={filter.selection}
						strings={this.props.strings}
					/>
				);
			} else if (filter.filter_type === POST_LIST_CONFIG.FILTERS.P2P) {
				const postTypesArray = _.map(filter.post_type, (key, value) => ({
					value,
					label: key,
				}));
				Template = (
					<PostListQueryRelatedFilter
						key={filter.filterID}
						filterID={filter.filterID}
						postTypes={postTypesArray}
						label={filter.label}
						selection={filter.selection}
						onChangeRelatedPosts={this.onChangeFilterGeneric}
						onRemoveClick={this.onRemoveFilter}
						strings={this.props.strings}
					/>
				);
			} else {
				const options = this.props[filter.filter_type][filter.value];
				Template = (
					<PostListQueryGeneralFilter
						key={filter.filterID}
						filterID={filter.filterID}
						label={filter.label}
						options={options}
						selection={filter.selection}
						onChangeSelection={this.onChangeFilterGeneric}
						onRemoveClick={this.onRemoveFilter}
						strings={this.props.strings}
					/>
				);
			}

			return Template;
		});

		return (
			<div className={filtersClasses}>
				{Filters}
			</div>
		);
	}

	/**
	 * Build out posts to display limit by the max number fo posts
	 *
	 * @method getFilteredPosts
	 */
	getFilteredPosts() {
		const keys = _.keys(this.state.queryPosts);
		const posts = _.map(keys, (key, index) => {
			let Container = null;
			if (index < this.state.max) {
				Container = (
					<PostPreviewContainer
						key={_.uniqueId('query-post-preview-')}
						post={this.state.queryPosts[key]}
					/>
				);
			}

			return Container;
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
		const postTypesFlat = _.map(this.state.postTypes, type => type.value);

		// first level for date
		filters = _.remove(filters, (filter) => {
			let check = true;
			if (filter.post_type) {
				const intersect = _.intersection(filter.post_type, postTypesFlat);
				check = intersect.length > 0;
			}
			return check;
		});

		// second level
		filters.forEach((filter) => {
			if (filter.options) {
				// if array
				if (filter.options.length) {
					// if array
					filter.options = _.remove(filter.options, (option) => { // eslint-disable-line no-param-reassign
						let check;
						if (!option.post_type) {
							check = true; // remove if no post_type
						} else if (option.post_type.length) { // check against array
							const intersect = _.intersection(option.post_type, postTypesFlat);
							check = intersect.length > 0;
						} else { // check against object and keys
							const keysIn = _.keysIn(option.post_type);
							const intersectKeys = _.intersection(keysIn, postTypesFlat);
							check = intersectKeys.length > 0;
						}
						return check;
					});
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
					<label className={styles.label}>{this.props.strings['label.content_type']}</label>
					<ReactSelect
						options={this.props.post_type}
						name={_.uniqueId('post-list-type-')}
						placeholder="Select Post Types"
						multi
						value={this.state.postTypes}
						onChange={this.handlePostTypeChange}
					/>
				</div>
				{this.props.show_max_control &&
					<div className={styles.row}>
						<PostListMaxChooser
							onChange={this.handleMaxChange}
							strings={this.props.strings}
							min={this.props.min}
							max={this.props.max}
							maxSelected={this.state.max}
						/>
					</div>}
				<div className={styles.row}>
					<label className={styles.label}>{this.props.strings['label.filters']}</label>
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

	/**
	 * Get preview params for posts.
	 *
	 * @method getPreviewRequestParams
	 */
	getPreviewRequestParams() {
		const filters = {};
		const types = [];
		_.forEach(this.state.postTypes, (type) => {
			types.push(type.value);
		});
		// post types
		if (this.state.postTypes.length) {
			filters.post_type = {
				selection: types,
				lock: true,
			};
		}
		// filters
		this.state.filters.forEach((filter) => {
			filters[filter.value] = {
				lock: true,
				selection: filter.selection,
			};
		});

		return param({
			action: 'posts-field-fetch-preview',
			filters,
			max: this.props.max,
			context: 1,
		});
	}

	/**
	 * Retrieve new posts. Add to cache
	 *
	 * @method getNewPosts
	 */
	getNewPosts() {
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

	/**
	 *  Initiates the panel data update callback
	 *
	 * @method initiateUpdatePanelData
	 */
	initiateUpdatePanelData() {
		this.props.updatePanelData({
			depth: this.props.depth,
			index: this.props.panelIndex,
			name: this.props.name,
			value: this.getValue(),
		});
	}

	/**
	 * Handle filter change
	 *
	 * @method handleFilterChange
	 */
	@autobind
	handleFilterChange(e) {
		// add new filter of the new type
		if (e && e.value) {
			const filterID = _.uniqueId('filter-id-');
			const filters = _.cloneDeep(this.state.filters);
			filters.push(_.assignIn(e, { filterID }));
			this.setState({
				filterValue: e.value,
				filters,
			}, () => {
				this.initiateUpdatePanelData();
			});
		}
	}

	/**
	 * Handle Max Select field change
	 *
	 * @method handleMaxChange
	 */
	@autobind
	handleMaxChange(e) {
		const max = e.value;
		if (max) {
			this.setState({
				max,
			}, () => {
				this.initiateUpdatePanelData();
			});
		}
	}

	/**
	 * Switch handle handler
	 *
	 * @method switchTabs
	 */
	@autobind
	switchTabs(e) {
		const type = e.currentTarget.classList.contains('pl-show-manual') ? 'manual' : 'query';
		this.setState({
			type,
		}, () => {
			this.initiateUpdatePanelData();
		});
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
			if (data.editableId === e.state.editableId) {
				// adding either a manual item or a select
				if (data.method === POST_LIST_CONFIG.POST_METHODS.Manual) {
					data.post_title = e.state.postTitle; // eslint-disable-line no-param-reassign
					data.post_content = e.state.postContent; // eslint-disable-line no-param-reassign
					data.url = e.state.postUrl; // eslint-disable-line no-param-reassign
					if (e.state.imageId) {
						data.thumbnail_id = e.state.imageId.toString(); // eslint-disable-line no-param-reassign
					} else {
						data.thumbnail_id = ''; // eslint-disable-line no-param-reassign
					}
					data.id = ''; // eslint-disable-line no-param-reassign
				} else if (data.method === POST_LIST_CONFIG.POST_METHODS.Select) {
					// only have id at this point... uses preview to retrieve the post data
					data.id = e.state.search; // eslint-disable-line no-param-reassign
					data.post_type = e.state.searchPostType; // eslint-disable-line no-param-reassign
				}
				data.isPreview = true; // eslint-disable-line no-param-reassign
			}
			return data;
		});
		this.setState(newState, () => {
			this.initiateUpdatePanelData();
		});
	}

	/**
	 * Handles cancel click on PostListPostManual and PostListPostSelected
	 *
	 * @method handleCancelClick
	 */
	@autobind
	handleCancelClick(e) {
		// todo: dont delete data if already populated on cancel
		// looking for editableId
		this.removePostFromList(e.state.editableId);
	}

	/**
	 * Handles remove click on post preview
	 *
	 * @method handleRemovePostClick
	 */
	@autobind
	handleRemovePostClick(e) {
		this.removePostFromList(e.editableId);
	}

	/**
	 * Handles edit click on post preview
	 *
	 * @method handleEditPostClick
	 */
	@autobind
	handleEditPostClick(e) {
		this.editPostFromList(e.state.editableId);
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
			if (post.editableId === e.editableId) {
				post = _.extend(post, newPost); // eslint-disable-line no-param-reassign
			}
		});
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
	 * Reorders the data and initiates a data update call
	 *
	 * @method handleManualSort
	 */
	@autobind
	handleManualSort(e) {
		const newState = _.cloneDeep(this.state);
		newState.manualPostData.splice(e.newIndex, 0, newState.manualPostData.splice(e.oldIndex, 1)[0]);
		this.setState(newState, () => {
			this.initiateUpdatePanelData();
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
		_.remove(newState.manualPostData, n => n.editableId === editableId);
		this.setState(newState, () => {
			this.initiateUpdatePanelData();
		});
	}

	editPostFromList(editableId) {
		// flag specific item as in preview state
		const manualPostData = _.cloneDeep(this.state.manualPostData);
		manualPostData.forEach((post) => {
			if (editableId === post.editableId) {
				post.isPreview = false; // eslint-disable-line no-param-reassign
			}
		});
		this.setState({
			manualPostData,
		}, () => {
			this.initiateUpdatePanelData();
		});
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
			thumbnail_id: post.thumbnail_id,
			url: post.url ? post.url : '',
			ID: parseInt(post.id, 10),
		};
	}

	/**
	 *  Maps real wp post data to the data format we're using for BE post
	 *
	 * @method mapWPPostToDataPost
	 */
	mapWPPostToDataPost(wpPost) {
		return {
			post_type: wpPost.post_type,
			post_title: wpPost.post_title,
			post_content: wpPost.post_excerpt,
			url: wpPost.permalink,
			id: wpPost.ID.toString(),
		};
	}

	/**
	 *  Adds editableID and isPreview to incoming data so we can manage it in react
	 *
	 * @method prepIncomingPosts
	 */
	prepIncomingPosts(posts) {
		posts.forEach((post) => {
			post.editableId = _.uniqueId('post-editable-');  // eslint-disable-line no-param-reassign
			post.isPreview = true;  // eslint-disable-line no-param-reassign
		});
		return posts;
	}

	/**
	 *  Prepare the post types for the state. Build array of post type label/value
	 *
	 * @method prepIncomingPostTypes
	 */
	prepIncomingPostTypes() {
		const postTypes = [];
		if (this.props.data.filters && this.props.data.filters.post_type) {
			const arrTypes = this.props.data.filters.post_type.selection;
			this.props.post_type.forEach((postType) => {
				arrTypes.forEach((type) => {
					if (postType.value === type) {
						postTypes.push(postType);
					}
				});
			});
		}
		return postTypes;
	}

	/**
	 *  Prepares the filters to use as a state variable.
	 *
	 * @method prepIncomingFilters
	 */
	prepIncomingFilters() {
		const filters = [];
		const filterKeys = _.keys(this.props.data.filters);
		filterKeys.forEach((filterKey) => {
			if (filterKey !== 'post_type') {
				const filterProps = this.getPropFilterByKey(filterKey);
				const filterData = this.props.data.filters[filterKey];
				if (filterProps && filterData) {
					filters.push({
						filter_type: filterProps.filter_type,
						filterID: _.uniqueId('post-list-filter'),
						selection: filterData.selection,
						post_type: filterProps.post_type,
						value: filterProps.value,
						label: filterProps.label,
					});
				} else {
					console.warn(`No filter was found for that filter key :${filterKey}`);
				}
			}
		});
		return filters;
	}

	/**
	 * Handle post type change
	 *
	 * @method handlePostTypeChange
	 */
	@autobind
	handlePostTypeChange(types) {
		if (types) {
			this.setState({
				postTypes: types,
			}, () => {
				this.getNewPosts();
				this.initiateUpdatePanelData();
			});
		} else {
			this.setState({
				postTypes: [],
			}, () => {
				this.getNewPosts();
				this.initiateUpdatePanelData();
			});
		}
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
	depth: React.PropTypes.number,
	strings: PropTypes.object,
	default: PropTypes.object,
	min: PropTypes.number,
	max: PropTypes.number,
	suggested: PropTypes.number,
	show_max_control: PropTypes.bool,
	post_type: PropTypes.array,
	filters: PropTypes.array,
	hidden_fields: PropTypes.array,
	taxonomies: PropTypes.object,
	data: PropTypes.object,
	panelIndex: PropTypes.number,
	updatePanelData: React.PropTypes.func,
};

PostList.defaultProps = {
	label: '',
	name: '',
	description: '',
	depth: 0,
	strings: {},
	default: {},
	min: 1,
	max: 12,
	suggested: 6,
	show_max_control: false,
	post_type: [],
	filters: [],
	hidden_fields: [],
	taxonomies: {},
	data: {},
	panelIndex: 0,
	updatePanelData: () => {
	},
};

export default PostList;
