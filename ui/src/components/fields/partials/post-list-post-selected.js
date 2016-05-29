import React, { Component } from 'react';
import ReactSelect from 'react-select-plus';
import autobind from 'autobind-decorator';
import { sortable } from 'react-anything-sortable';

import styles from './post-list-post-selected.pcss';

@sortable
class PostListPostSelected extends Component {
	state = {
		type: '',
	};

	@autobind
	handleChange(data){
		const type = data ? data.value : '';
		this.setState({ type });
	}

	render() {
		return (
			<div {...this.props}>
				<article className={styles.wrapper}>
					<ReactSelect
						name={_.uniqueId('post-selected-')}
						value={this.state.type}
						searchable={false}
						options={this.props.post_type}
						onChange={this.handleChange}
					/>
				</article>
			</div>
		);
	}
}

export default PostListPostSelected;
