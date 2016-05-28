import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ReactSelect from 'react-select-plus';
import _ from 'lodash';

import MediaUploader from '../shared/media-uploader';
import PostListAddManual from './partials/post-list-add-manual';
import Button from '../shared/button';
import Notification from '../shared/notification';

import styles from './post-list.pcss';

class PostList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.default.type,

			// todo: hookup to existing post count from data
			manual_post_count: 0,
			manual_add_count: this.props.min,
		};
		this.handleChange = this.handleChange.bind(this);
		this.addManualPost = this.addManualPost.bind(this);
		this.addSelectPost = this.addSelectPost.bind(this);
		this.switchTabs = this.switchTabs.bind(this);
	}

	handleChange() {
		// code to connect to actions that execute on redux store
	}

	switchTabs(e) {
		const type = e.currentTarget.classList.contains('pl-show-manual') ? 'manual' : 'query';
		this.setState({ type });
	}

	getTabButtons() {
		const manualButtonClasses = classNames({
			'pl-show-manual': true,
			[styles.active]: this.state.type === 'manual',
		});

		const queryButtonClasses = classNames({
			'pl-show-query': true,
			[styles.active]: this.state.type === 'query',
		});

		return (
			<div className={styles.tabs}>
				<Button
					classes={manualButtonClasses}
					text={this.props.strings['tabs.manual']}
					full={false}
					handleClick={this.switchTabs}
				/>
				<Button
					classes={queryButtonClasses}
					text={this.props.strings['tabs.dynamic']}
					full={false}
					handleClick={this.switchTabs}
				/>
			</div>
		);
	}

	addSelectPost() {
		// add post select
	}

	addManualPost() {
		// add manual post
	}

	getManualTemplate() {
		const tabClasses = classNames({
			[styles.tabContent]: true,
			[styles.active]: this.state.type === 'manual',
		});
		const AddTemplate = _.times(this.state.manual_add_count, (i) =>
			<PostListAddManual
				key={`add-manual-post-${i}`}
				index={i}
				handleSelectClick={this.addSelectPost}
				handleManualClick={this.addManualPost}
				strings={this.props.strings}
			/>
		);

		return (
			<div className={tabClasses}>
				<Notification
					text="This panel requires 2 more items"
					type="warn"
				/>
				{AddTemplate}
			</div>
		);
	}

	getQueryTemplate() {
		const tabClasses = classNames({
			[styles.tabContent]: true,
			[styles.active]: this.state.type === 'query',
		});

		return (
			<div className={tabClasses}>
				<ReactSelect
					options={this.props.filters}
					onChange={this.handleChange}
				/>
			</div>
		);
	}

	render() {
		return (
			<div className={styles.field}>
				<legend className={styles.label}>{this.props.label}</legend>
				{this.getTabButtons()}
				<div className={styles.tabWrapper}>
					{this.getManualTemplate()}
					{this.getQueryTemplate()}
				</div>
				<p className={styles.description}>{this.props.description}</p>
			</div>
		);
	}
}

PostList.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.object,
	default: PropTypes.object,
	min: PropTypes.number,
	max: PropTypes.number,
	suggested: PropTypes.number,
	show_max_control: PropTypes.bool,
	post_type: PropTypes.array,
	filters: PropTypes.object,
};

PostList.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: {},
	default: {},
	min: 1,
	max: 12,
	suggested: 6,
	show_max_control: false,
	post_type: [],
	filters: {},
};

export default PostList;
