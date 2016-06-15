import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';

import styles from './post-list-query-related-filter.pcss';

class PostListQueryRelatedFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			postTypes: [],
		};
	}

	@autobind
	handleTypeChange(postTypes) {
		if (postTypes){
			this.setState({
				postTypes,
			},() => {
				this.props.onChangeRelatedPosts({
					state: this.state,
				})
			});
		} else {
			this.setState({
				postTypes: [],
			},() => {
				this.props.onChangeRelatedPosts({
					state: this.state,
				})
			});
		}
	}

	render() {
		return (
			<div className={styles.filter}>
				<div className={styles.remove}><span className='dashicons dashicons-no-alt' onClick={this.props.onRemoveClick} /></div>
				<label className={styles.label}>Related Posts</label>
				<span className={styles.inputContainer}>
					<ReactSelect
						value={this.state.postTypes}
						name="query-related-post-type"
						multi
						options={this.props.postTypes}
						placeholder=""
						onChange={this.handleTypeChange}
					/>
				</span>
			</div>
		);
	}
}

PostListQueryRelatedFilter.propTypes = {
	onRemoveClick: React.PropTypes.func,
	onChangeRelatedPosts: React.PropTypes.func,
	postTypes: React.PropTypes.array,
};

PostListQueryRelatedFilter.defaultProps = {
	onRemoveClick: () => {},
	onChangeRelatedPosts: () => {},
	postTypes: [],
};

export default PostListQueryRelatedFilter;
