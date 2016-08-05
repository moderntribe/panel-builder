import React, { Component, PropTypes } from 'react';
import ReactSelect from 'react-select-plus';
import autobind from 'autobind-decorator';
import request from 'superagent';

import objectToParams from '../../../util/data/object-to-params';
import Button from '../../shared/button';

import styles from './post-list-post-selected.pcss';

class PostListPostSelected extends Component {
	state = {
		searchPostType: '',
		selectedPost: '',
		loading: false,
		search: '',
		editableId: this.props.editableId,
		method: 'select',
	};

	getRequestParams(input) {
		return objectToParams({
			action: 'posts-field-posts-search',
			s: input,
			type: 'query-panel',
			paged: 1,
			post_type: this.state.searchPostType,
			field_name: 'items',
		});
	}

	@autobind
	getOptions(input, callback) {
		let data;
		if (!this.state.searchPostType.length && !input.length) {
			callback(null, data);
			return;
		}
		this.setState({ loading: true });
		request
			.get(`${window.ajaxurl}?${this.getRequestParams(input)}`)
			.end((err, response) => {
				this.setState({ loading: false });
				if (response.body.posts.length) {
					data = {
						options: response.body.posts,
					};
				}
				callback(null, data);
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
	handleSearchChange(data) {
		const search = data ? data.value : '';
		this.setState({ search });
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

	/**
	 * Checks if the post has what it needs to be added
	 *
	 * @method isAddBtnDisabled
	 */
	isAddBtnDisabled() {
		return this.state.search.length === 0;
	}

	render() {
		return (
			<article className={styles.wrapper}>
				<ReactSelect
					name={_.uniqueId('post-selected-')}
					value={this.state.searchPostType}
					searchable={false}
					options={this.props.post_type}
					onChange={this.handleChange}
				/>
				<ReactSelect.Async
					disabled={this.state.searchPostType.length === 0}
					value={this.state.search}
					name="manual-selected-post"
					loadOptions={this.getOptions}
					noResultsText={this.props.strings['label.no-results']}
					isLoading={false}
					onChange={this.handleSearchChange}
				/>
				<footer className={styles.footer}>
					<Button
						text={this.props.strings['button.add_to_panel']}
						primary={false}
						full={false}
						disabled={this.isAddBtnDisabled()}
						handleClick={this.handleAddToPanelClick}
					/>
					<Button
						text={this.props.strings['button.cancel_panel']}
						handleClick={this.handleCancelClick}
						full={false}
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
