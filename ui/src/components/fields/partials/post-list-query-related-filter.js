import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';
import request from 'superagent';
import param from 'jquery-param';

import * as AdminCache from '../../../util/data/admin-cache';

import styles from './post-list-query-related-filter.pcss';

class PostListQueryRelatedFilter extends Component {
	state = {
		postTypes: [],
		post: this.props.selection ? parseInt(this.props.selection, 10) : '',
		isSavedSelection: Boolean(this.props.selection),
	};
	noResults = {
		options: [{
			value: 0,
			label: 'No Results',
		}],
	};

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
	@autobind
	getOptions(input, callback) {
		let data = this.noResults;
		if (!this.state.postTypes.length && !input.length) {
			callback(null, data);
			return;
		}
		const ajaxURL = `${window.ajaxurl}?${this.getSearchRequestParams(input)}`;
		request.get(ajaxURL).end((err, response) => {
			if (response.body.posts.length) {
				data = {
					options: response.body.posts,
				};
			}
			callback(null, data);
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
					<ReactSelect.Async
						value={this.state.post}
						name="manual-selected-post"
						loadOptions={this.getOptions}
						placeholder={this.props.strings['label.relationship-post-select-placeholder']}
						onChange={this.handlePostChange}
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
	strings: React.PropTypes.object,
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
