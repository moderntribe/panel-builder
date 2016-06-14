import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import DatePicker from 'react-datepicker';
import moment from 'moment';

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
			startDate:this.props.startDate,
			endDate:this.props.endDate,
		};
	}

	@autobind
	handleChangeStart(e) {
		this.setState({
			startDate: e,
		}, () => {
			this.props.onChangeDate({
				state: this.state,
			});
		});
	}

	@autobind
	handleChangeEnd(e) {
		this.setState({
			endDate: e,
		}, () => {
			this.props.onChangeDate({
				state: this.state,
			})
		});
	}

	render() {
		return (
			<div className={styles.filter}>
				<div className={styles.remove}><span className='dashicons dashicons-no-alt' onClick={this.props.onRemoveClick} /></div>
				<label className={styles.label}>Date</label>
				<span className={styles.inputContainer}>
					<DatePicker
						selected={this.state.startDate}
						placeholderText='Start Date'
						onChange={this.handleChangeStart} />
					<DatePicker
						selected={this.state.endDate}
						placeholderText='End Date'
						onChange={this.handleChangeEnd} />
				</span>
			</div>
		);
	}
}

PostListQueryDateFilter.propTypes = {
	onRemoveClick: React.PropTypes.func,
	onChangeDate: React.PropTypes.func,
	startDate: React.PropTypes.object,
	endDate: React.PropTypes.object,
};

PostListQueryDateFilter.defaultProps = {
	onRemoveClick: () => {},
	onChangeDate: () => {},
	startDate: null,
	endDate: null,
};

export default PostListQueryDateFilter;
