import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';

import styles from './post-list-query-tag-filter.pcss';

class PostListQueryTagFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: [],
		};
	}

	@autobind
	handleTaxonomyChange(tags) {
		if (tags){
			this.setState({
				tags,
			},() => {
				this.props.onChangeTag({
					state: this.state,
				})
			});
		} else {
			this.setState({
				tags: [],
			},() => {
				this.props.onChangeTag({
					state: this.state,
				})
			});
		}
	}

	render() {
		return (
			<div className={styles.filter}>
				<div className={styles.remove}><span className='dashicons dashicons-no-alt' onClick={this.props.onRemoveClick} /></div>
				<label className={styles.label}>Tags</label>
				<span className={styles.inputContainer}>
					<ReactSelect
						value={this.state.tags}
						name="query-taxonomy"
						multi
						options={this.props.options}
						placeholder=""
						onChange={this.handleTaxonomyChange}
					/>

				</span>
			</div>
		);
	}
}

PostListQueryTagFilter.propTypes = {
	onRemoveClick: React.PropTypes.func,
	onChangeTag: React.PropTypes.func,
	options: React.PropTypes.array,
};

PostListQueryTagFilter.defaultProps = {
	onRemoveClick: () => {},
	onChangeTag: () => {},
	options: [],
};

export default PostListQueryTagFilter;
