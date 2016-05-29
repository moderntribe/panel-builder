import React, { Component, PropTypes } from 'react';
import ReactSelect from 'react-select-plus';
import autobind from 'autobind-decorator';
import request from 'superagent';

import objectToParams from '../../../util/data/object-to-params';

import styles from './post-list-post-selected.pcss';

class PostListPostSelected extends Component {
	state = {
		search_post_type: '',
		selected_post: '',
		loading: false,
		search: '',
	};

	noResults = {
		options: [{
			value: 0,
			label: 'No Results',
		}],
	};

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

	@autobind
	getOptions(input, callback) {
		let data = this.noResults;
		if (!this.state.search_post_type.length && !input.length) {
			callback(null, data);
			return;
		}
		this.setState({ loading: true });
		request
			.get(`${window.ajaxurl}?${this.getRequestParams(input)}`)
			.end((err, response) => {
				this.setState({ loading: false });
				if(response.body.posts.length){
					data = {
						options: response.body.posts,
					};
				}
				callback(null, data);
			});
	}

	@autobind
	handleChange(data){
		const search_post_type = data ? data.value : '';
		this.setState({
			search_post_type,
			search: '',
		});
	}

	@autobind
	handleSearchChange(data){
		const search = data ? data.value : '';
		this.setState({ search });
	}

	render() {
		return (
			<article className={styles.wrapper}>
				<ReactSelect
					name={_.uniqueId('post-selected-')}
					value={this.state.search_post_type}
					searchable={false}
					options={this.props.post_type}
					onChange={this.handleChange}
				/>
				<ReactSelect.Async
					disabled={this.state.search_post_type.length === 0}
					value={this.state.search}
					name="manual-selected-post"
					loadOptions={this.getOptions}
					isLoading={false}
					onChange={this.handleSearchChange}
				/>
			</article>
		);
	}
}



PostListPostSelected.propTypes = {
	name: PropTypes.string,
	post_type: PropTypes.array,
};

PostListPostSelected.defaultProps = {
	name: '',
	post_type: [],
};

export default PostListPostSelected;
