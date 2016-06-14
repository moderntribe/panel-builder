import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import styles from './post-list-query-date-filter.pcss';

class PostListQueryDateFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tag: '',
			startDate:moment(),
			endDate:moment().add(7, 'days'),
		};
	}

	@autobind
	handleChangeStart(e) {
		this.setState({
			startDate: e,
		}, () => {
			this.props.onChangeTag({
				state: this.state,
			});
		});
	}

	@autobind
	handleChangeEnd(e) {
		this.setState({
			endDate: e,
		}, () => {
			this.props.onChangeTag({
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
						startDate={this.state.startDate}
						endDate={this.state.endDate}
						placeholder='Start Date'
						onChange={this.handleChangeStart} />
					<DatePicker
						selected={this.state.endDate}
						startDate={this.state.startDate}
						endDate={this.state.endDate}
						placeholder='End Date'
						onChange={this.handleChangeEnd} />
				</span>
			</div>
		);
	}
}

PostListQueryDateFilter.propTypes = {
	onRemoveClick: React.PropTypes.func,
	onChangeTag: React.PropTypes.func,
};

PostListQueryDateFilter.defaultProps = {
	onRemoveClick: () => {},
	onChangeTag: () => {},
};

export default PostListQueryDateFilter;
