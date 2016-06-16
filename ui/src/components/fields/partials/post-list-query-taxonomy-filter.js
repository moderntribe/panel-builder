import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';

import styles from './post-list-query-taxonomy-filter.pcss';

class PostListQueryTaxonomyFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: [],
		};
	}

	broadcastDataChange() {
		const selection = _.map(this.state.tags, (tag) => {
			return tag.value;
		});
		this.props.onChangeTaxonomy({
			state: this.state,
			filterID: this.props.filterID,
			selection,
		})
	}

	@autobind
	handleTaxonomyChange(tags) {
		if (tags){
			this.setState({
				tags,
			},() => {
				this.broadcastDataChange();
			});
		} else {
			this.setState({
				tags: [],
			},() => {
				this.broadcastDataChange();
			});
		}
	}

	@autobind
	handleRemove(e) {
		this.props.onRemoveClick({
			state: this.state,
			filterID: this.props.filterID,
		})
	}

	render() {
		return (
			<div className={styles.filter}>
				<div className={styles.remove}><span className='dashicons dashicons-no-alt' onClick={this.handleRemove} /></div>
				<label className={styles.label}>{this.props.label}</label>
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

PostListQueryTaxonomyFilter.propTypes = {
	onRemoveClick: React.PropTypes.func,
	onChangeTaxonomy: React.PropTypes.func,
	options: React.PropTypes.array,
	filterID: React.PropTypes.string,
	label: React.PropTypes.string,
};

PostListQueryTaxonomyFilter.defaultProps = {
	onRemoveClick: () => {},
	onChangeTaxonomy: () => {},
	options: [],
	filterID: '',
	label: '',
};

export default PostListQueryTaxonomyFilter;
