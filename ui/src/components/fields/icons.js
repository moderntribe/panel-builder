import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

import styles from './icons.pcss';

class Icons extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: _.uniqueId('icon-library-'),
			search: '',
			value: this.props.data,
		};
	}

	getOptionsForState() {
		if (!this.state.search.length) {
			return this.props.options;
		}
		return this.props.options.filter(icon => icon.value.indexOf(this.state.search) !== -1);
	}

	@autobind
	handleChange(e) {
		const value = e.currentTarget.value;
		this.updateState(value);
	}

	@autobind
	handleSearch(e) {
		const search = e.currentTarget.value;
		this.setState({ search });
	}

	updateState(value) {
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value,
		});
	}

	render() {
		const iconLabelClasses = classNames({
			'plicons-label': true,
			[styles.iconLabel]: true,
		});

		const Options = _.map(this.getOptionsForState(), (option) => {
			const iconClasses = classNames({
				'fa': true,
				'fa-2x': true,
				[styles.icon]: true,
				[option.value]: true,
			});
			return (
				<label
					className={iconLabelClasses}
					key={_.uniqueId('option-icon-id-')}
				>
					<input
						type="radio"
						name={`modular-content-${this.props.name}`}
						value={option.value}
						onChange={this.handleChange}
						checked={this.state.value === option.value}
						data-option-type="single"
						data-field="image-select"
					/>
					<i title={option.value} className={iconClasses} />
				</label>
			);
		});

		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});

		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});
		const containerClasses = classNames({
			[styles.container]: true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
			'panel-conditional-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{this.props.label}
				</label>
				{this.props.search && <div className={styles.searchWrapper}>
					<input className={styles.search} value={this.state.search} onChange={this.handleSearch} placeholder="Search Icon Library" />
				</div>}
				<div className={containerClasses}>
					{Options}
				</div>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Icons.propTypes = {
	label: React.PropTypes.string,
	name: React.PropTypes.string,
	description: React.PropTypes.string,
	strings: React.PropTypes.object,
	indexMap: React.PropTypes.array,
	depth: React.PropTypes.number,
	default: React.PropTypes.string,
	options: React.PropTypes.array,
	data: React.PropTypes.string,
	search: React.PropTypes.bool,
	panelIndex: React.PropTypes.number,
	updatePanelData: React.PropTypes.func,
};

Icons.defaultProps = {
	label: '',
	name: '',
	description: '',
	indexMap: [],
	strings: {},
	depth: 0,
	default: '',
	options: [],
	data: '',
	search: false,
	panelIndex: 0,
	updatePanelData: () => {},
};

export default Icons;
