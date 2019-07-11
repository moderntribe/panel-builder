import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select-plus';
import autobind from 'autobind-decorator';
import request from 'superagent';

import objectToParams from '../../../util/data/object-to-params';
import queryToJson from '../../../util/data/query-to-json';
import Button from '../../shared/button';

import styles from './post-list-post-selected.pcss';

class PostListPostSelected extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchPostType: '',
			loading: false,
			options: [],
			inputValue: '',
			search: '',
			editableId: this.props.editableId,
			method: 'select',
		};
		this.request = null;
	}

	getRequestParams(input) {
		const queryParams = queryToJson();
		const postId = typeof queryParams.post === 'undefined' ? 'new' : queryParams.post;

		return objectToParams({
			action: 'posts-field-posts-search',
			s: input,
			type: 'query-panel',
			paged: 1,
			post_type: this.state.searchPostType,
			field_name: 'items',
			post_id: postId,
		});
	}

	@autobind
	handleChange(data) {
		const searchPostType = data ? data.value : '';
		this.setState({
			searchPostType,
			search: '',
		});
	}

	@autobind
	handleCancelClick(e) {
		e.preventDefault();
		this.props.handleCancelClick({
			state: this.state,
		});
	}

	@autobind
	handleAddToPanelClick(e) {
		e.preventDefault();
		this.props.handleAddClick({
			state: this.state,
		});
	}

	@autobind
	handleOnPostInputChange(input) {
		const inputValue = _.isString(input) ? input : '';
		this.setState({ inputValue, loading: true });
		const ajaxURL = `${window.ajaxurl}?${this.getRequestParams(inputValue)}`;
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
	 * Handler for post select change
	 *
	 * @method handlePostSearchChange
	 */
	@autobind
	handlePostSearchChange(data) {
		if (data) {
			this.setState({
				search: data.value,
				inputValue: '',
			});
		} else {
			this.setState({
				search: '',
				inputValue: '',
				options: [],
			});
		}
	}

	/**
	 * Checks if the post has what it needs to be added
	 *
	 * @method isAddBtnDisabled
	 */
	isAddBtnDisabled() {
		return this.state.search.length === 0;
	}

	render() {
		const noResultsTextSearch = (this.state.inputValue) ? this.props.strings['placeholder.no_results'] : this.props.strings['placeholder.select_search'];
		return (
			<article className={styles.wrapper}>
				<ReactSelect
					name={_.uniqueId('post-selected-')}
					value={this.state.searchPostType}
					searchable={false}
					options={this.props.post_type}
					onChange={this.handleChange}
				/>
				<ReactSelect
					disabled={this.state.searchPostType.length === 0}
					value={this.state.search}
					name={_.uniqueId('post-list-search-selected-')}
					options={this.state.options}
					onInputChange={this.handleOnPostInputChange}
					noResultsText={noResultsTextSearch}
					placeholder={this.props.strings['placeholder.select_post']}
					isLoading={this.state.loading}
					onFocus={this.handleOnPostInputChange}
					onBlur={this.handlePostSearchBlur}
					onChange={this.handlePostSearchChange}
				/>
				<footer className={styles.footer}>
					<Button
						text={this.props.strings['button.add_to_panel']}
						primary={false}
						full={false}
						disabled={this.isAddBtnDisabled()}
						handleClick={this.handleAddToPanelClick}
						rounded
					/>
					<Button
						text={this.props.strings['button.cancel_panel']}
						handleClick={this.handleCancelClick}
						full={false}
						rounded
					/>
				</footer>
			</article>
		);
	}
}

PostListPostSelected.propTypes = {
	name: PropTypes.string,
	post_type: PropTypes.array,
	handleCancelClick: PropTypes.func,
	handleAddClick: PropTypes.func,
	editableId: PropTypes.string,
	strings: PropTypes.object,
};

PostListPostSelected.defaultProps = {
	name: '',
	post_type: [],
	handleCancelClick: () => {},
	handleAddClick: () => {},
	editableId: '',
	strings: {},
};

export default PostListPostSelected;
