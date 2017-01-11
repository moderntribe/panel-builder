import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select-plus';
import _ from 'lodash';

import styles from './post-list-query-general-filter.pcss';

class PostListQueryGeneralFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: this.getInitialTags(),
		};
	}

	/**
	 *  fills tags state var based on default selection data
	 *
	 * @method getInitialTags
	 */
	getInitialTags() {
		const tags = [];
		if (this.props.selection.length) {
			this.props.selection.forEach((selection) => {
				const nxtOption = _.find(this.props.options, { value: parseInt(selection, 10) });
				if (nxtOption) {
					tags.push(nxtOption);
				}
			});
		}
		return tags;
	}

	/**
	 *  Callback for data change
	 *
	 * @method broadcastDataChange
	 */
	broadcastDataChange() {
		const selection = _.map(this.state.tags, (tag) => tag.value);
		this.props.onChangeSelection({
			state: this.state,
			filterID: this.props.filterID,
			selection,
		});
	}

	/**
	 *  Handler for selection change
	 *
	 * @method handleSelectionChange
	 */
	@autobind
	handleSelectionChange(tags) {
		if (tags) {
			this.setState({
				tags,
			}, () => {
				this.broadcastDataChange();
			});
		} else {
			this.setState({
				tags: [],
			}, () => {
				this.broadcastDataChange();
			});
		}
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
						value={this.state.tags}
						name={_.uniqueId('query-general')}
						multi
						options={this.props.options}
						placeholder={this.props.strings['label.select-placeholder']}
						onChange={this.handleSelectionChange}
					/>
				</span>
			</div>
		);
	}
}

PostListQueryGeneralFilter.propTypes = {
	onRemoveClick: PropTypes.func,
	onChangeSelection: PropTypes.func,
	options: PropTypes.array,
	filterID: PropTypes.string,
	label: PropTypes.string,
	selection: PropTypes.array,
	strings: React.PropTypes.object,
};

PostListQueryGeneralFilter.defaultProps = {
	onRemoveClick: () => {},
	onChangeSelection: () => {},
	options: [],
	filterID: '',
	label: '',
	selection: [],
	strings: {},
};

export default PostListQueryGeneralFilter;
