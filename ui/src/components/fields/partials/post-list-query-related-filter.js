import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';
import request from 'superagent';
import param from 'jquery-param';

import * as AdminCache from '../../../util/data/admin-cache';

import styles from './post-list-query-related-filter.pcss';

class PostListQueryRelatedFilter extends Component {
	constructor(props) {
		super(props);
		this.getOptions = _.debounce(this.getOptions.bind(this), 450);
		this.state = this.getInitialState();
	}

	noResults = { // eslint-disable-line
		options: [{
			value: 0,
			label: this.props.strings['label.relationship-no-results'],
		}],
	};

	/**
	 * Retrieve initial state
	 *
	 * @method getInitialState
	 */
	getInitialState() {
		const state = {
			postTypes: [],
			post: this.props.selection ? parseInt(this.props.selection, 10) : '',
			postOptions: [],
			postsIsLoading: false,
			isSavedSelection: Boolean(this.props.selection),
		};

		// if we have a post but no post options for saved state
		if (state.post && state.postOptions.length < 1) {
			const cachedPost = AdminCache.getPostById(state.post);
			if (cachedPost) {
				state.postOptions = [{
					value: cachedPost.ID,
					label: cachedPost.post_title,
				}];
				const pType = _.find(this.props.postTypes, { value: cachedPost.post_type });
				if (pType) {
					state.postTypes = [
						pType,
					];
				}
			}
		}
		return state;
	}

	componentWillMount() {
		if (this.state.isSavedSelection) {
			const cachedPost = AdminCache.getPostById(parseInt(this.props.selection, 10));
			if (cachedPost) {
				this.noResults.options.push({
					value: cachedPost.ID,
					label: cachedPost.post_title,
				});
			}
		}
	}

	/**
	 * Get search params for posts limited by type
	 *
	 * @method getSearchRequestParams
	 */
	getSearchRequestParams(input) {
		const types = [];
		_.forEach(this.state.postTypes, (type) => {
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
	 * Handler to pass into react select for showing posts
	 *
	 * @method getOptions
	 */
	getOptions(value) {
		this.setState({ postsIsLoading: true });
		const ajaxURL = `${window.ajaxurl}?${this.getSearchRequestParams(value)}`;
		request.get(ajaxURL).end((err, response) => {
			const newState = { postsIsLoading: false };
			if (response.body.posts.length) {
				newState.postOptions = response.body.posts;
			}
			this.setState(newState);
		});
	}

	/**
	 *  Handler for type change
	 *
	 * @method handleTypeChange
	 */
	@autobind
	handleTypeChange(postTypes) {
		if (postTypes) {
			this.setState({
				postTypes,
			});
		}
	}

	@autobind
	maybeGetOptions(input) {
		if (input.currentTarget.value.length) {
			return;
		}
		this.getOptions(input.currentTarget.value);
	}

	/**
	 * Handler for post select change
	 *
	 * @method handlePostSearchChange
	 */
	@autobind
	handlePostChange(data) {
		const post = data ? data.value : '';
		this.setState({
			post,
		}, () => {
			this.props.onChangeRelatedPosts({
				state: this.state,
				filterID: this.props.filterID,
				selection: post.toString(),
			});
		});
	}

	/**
	 *  Handler for remove filter click
	 *
	 * @method handleRemove
	 */
	@autobind
	handleRemove() {
		this.props.onRemoveClick({
			state: this.state,
			filterID: this.props.filterID,
		});
	}

	render() {
		return (
			<div className={styles.filter}>
				<div className={styles.remove}><span className="dashicons dashicons-no-alt" onClick={this.handleRemove} /></div>
				<label className={styles.label}>{this.props.label}</label>
				<span className={styles.inputContainer}>
					<ReactSelect
						value={this.state.postTypes}
						name="query-related-post-type"
						multi
						options={this.props.postTypes}
						placeholder={this.props.strings['label.relationship-post-type-placeholder']}
						onChange={this.handleTypeChange}
					/>
					<ReactSelect
						value={this.state.post}
						name="manual-selected-post"
						isLoading={this.state.postsIsLoading}
						options={this.state.postOptions}
						placeholder={this.props.strings['label.relationship-post-select-placeholder']}
						onChange={this.handlePostChange}
						onInputChange={this.getOptions}
						onFocus={this.maybeGetOptions}
					/>
				</span>
			</div>
		);
	}
}

PostListQueryRelatedFilter.propTypes = {
	onRemoveClick: PropTypes.func,
	onChangeRelatedPosts: PropTypes.func,
	postTypes: PropTypes.array,
	filterID: PropTypes.string,
	label: PropTypes.string,
	selection: PropTypes.string,
	strings: PropTypes.object,
};

PostListQueryRelatedFilter.defaultProps = {
	onRemoveClick: () => {},
	onChangeRelatedPosts: () => {},
	postTypes: [],
	filterID: '',
	label: '',
	selection: null,
	strings: {},
};

export default PostListQueryRelatedFilter;
