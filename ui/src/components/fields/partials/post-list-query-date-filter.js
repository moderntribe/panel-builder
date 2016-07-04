import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { POST_LIST_CONFIG } from '../../../globals/config';

import styles from './post-list-query-date-filter.pcss';

/**
 * Component for query date filter
 * Event return current state with moment date values
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

class PostListQueryDateFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: this.props.selection ? moment(this.props.selection.start, POST_LIST_CONFIG.date_format) : null,
			endDate: this.props.selection ? moment(this.props.selection.end, POST_LIST_CONFIG.date_format) : null,
		};
	}

	/**
	 *  Initiates data update callback
	 *
	 * @method broadcastDataChange
	 */
	broadcastDataChange() {
		const start = this.state.startDate ? this.state.startDate.format(POST_LIST_CONFIG.date_format) : null;
		const end = this.state.endDate ? this.state.endDate.format(POST_LIST_CONFIG.date_format) : null;
		const selection = {
			start,
			end,
		};
		this.props.onChangeDate({
			state: this.state,
			filterID: this.props.filterID,
			selection,
		});
	}

	/**
	 *  Handle start date change
	 *
	 * @method handleChangeStart
	 */
	@autobind
	handleChangeStart(e) {
		this.setState({
			startDate: e,
		}, () => {
			this.broadcastDataChange();
		});
	}

	/**
	 *  Handle end date change
	 *
	 * @method handleChangeEnd
	 */
	@autobind
	handleChangeEnd(e) {
		this.setState({
			endDate: e,
		}, () => {
			this.broadcastDataChange();
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
					<DatePicker
						selected={this.state.startDate}
						placeholderText="Start Date"
						onChange={this.handleChangeStart}
					/>
					<DatePicker
						selected={this.state.endDate}
						placeholderText="End Date"
						onChange={this.handleChangeEnd}
					/>
				</span>
			</div>
		);
	}
}

PostListQueryDateFilter.propTypes = {
	onRemoveClick: PropTypes.func,
	onChangeDate: PropTypes.func,
	selection: PropTypes.object,
	filterID: PropTypes.string,
	label: PropTypes.string,
};

PostListQueryDateFilter.defaultProps = {
	onRemoveClick: () => {},
	onChangeDate: () => {},
	selection: null,
	filterID: '',
	label: ',',
};

export default PostListQueryDateFilter;
