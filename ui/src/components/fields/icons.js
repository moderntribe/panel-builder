import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import _ from 'lodash';

import { ICON_LIBRARIES } from '../../globals/config';

import styles from './icons.pcss';
import Button from '../shared/button';
import Loader from '../shared/loader';
import * as ajax from '../../util/ajax';
import { UI_I18N } from '../../globals/i18n';

class Icons extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: _.uniqueId('icon-library-'),
			loadedCategories: [],
			mode: _.isEmpty(this.props.categories) ? 'single' : 'categorized',
			loading: this.needsToFetchIcons(),
			options: this.getInitialOptions(),
			search: '',
			value: this.props.data,
		};
		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
		if (this.state.loading) {
			this.fetchIcons();
		}
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	getOptionsForState(key = 'value') {
		if (!this.state.search.length) {
			return this.state.options;
		}
		return this.state.options.filter(icon => icon[key].indexOf(this.state.search) !== -1);
	}

	getSelectedIcon() {
		const externalClasses = this.props.class_string.replace('%s', `${this.props.icon_prefix}${this.state.value}`);
		const iconClasses = classNames({
			[externalClasses]: true,
			[styles.selectedIcon]: true,
		});
		return (
			<div className={styles.selectedWrap}>
				{this.props.strings['label.selected']}
				<i className={iconClasses} />
				<Button
					icon="dashicons-trash"
					bare
					full={false}
					classes={styles.deleteIcon}
					handleClick={this.handleDeleteIcon}
				/>
			</div>
		);
	}

	@autobind
	handleDeleteIcon() {
		this.setState({ value: '' });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
			name: this.props.name,
			value: '',
		});
	}

	@autobind
	handleChange(e) {
		const { value } = e.currentTarget;
		this.updateState(value);
	}

	@autobind
	handleSearch(e) {
		const search = e.currentTarget.value;
		this.setState({ search });
	}

	@autobind
	revealCategory(e) {
		const category = e.currentTarget.dataset.id;
		const { loadedCategories } = this.state;
		loadedCategories.push(category);
		this.setState({ loadedCategories });
	}

	updateState(value) {
		this.setState({ value });
		this.props.updatePanelData({
			depth: this.props.depth,
			indexMap: this.props.indexMap,
			parentMap: this.props.parentMap,
			name: this.props.name,
			value,
		});
	}

	getOption(option, iconLabelClasses) {
		const externalClasses = this.props.class_string.replace('%s', `${this.props.icon_prefix}${option.value}`);
		const iconClasses = classNames({
			[externalClasses]: true,
			[styles.icon]: true,
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
					data-field="icon-select"
					data-depth={this.props.depth}
				/>
				<i title={option.value} className={iconClasses} />
			</label>
		);
	}

	getCategory({ category = 'uncategorized', label = UI_I18N['label.uncategorized'], icons }) {
		const iconLabelClasses = classNames({
			'plicons-label': true,
			[styles.iconLabel]: true,
		});
		return (
			<div className={styles.category} key={_.uniqueId('category-')}>
				<h4 className={styles.categoryHeading}>{label}</h4>
				{icons.map((icon, i) => {
					if (this.state.loadedCategories.indexOf(category) === -1 && !this.state.search.length && i === 18 && icons.length > 18) {
						return (
							<div className={styles.showMoreWrap}>
								<Button
									text={UI_I18N['button.show_all']}
									icon="dashicons-arrow-down"
									classes={styles.showMore}
									dataID={category}
									handleClick={this.revealCategory}
									secondary
									rounded
								/>
							</div>
						);
					}
					if (this.state.loadedCategories.indexOf(category) === -1 && !this.state.search.length && i > 17) {
						return null;
					}
					return this.getOption({ value: icon.name }, iconLabelClasses);
				})}
			</div>
		);
	}

	getCategorizedOptions() {
		if (this.state.loading) {
			return null;
		}
		const options = this.getOptionsForState('name');
		const uncategorizedIcons = options.filter(option => !option.categories.length);
		const uncategorized = uncategorizedIcons.length ? this.getCategory({ icons: uncategorizedIcons }) : null;
		const categories = Object.entries(this.props.categories).map(([key, label]) => {
			const icons = options.filter(option => option.categories[0] === key);
			if (!icons.length) {
				return null;
			}
			return this.getCategory({ category: key, icons, label });
		});
		return [uncategorized, categories];
	}

	getSingleOptions() {
		if (this.state.loading) {
			return null;
		}
		const iconLabelClasses = classNames({
			'plicons-label': true,
			[styles.iconLabel]: true,
		});
		return _.map(this.getOptionsForState(), option => this.getOption(option, iconLabelClasses));
	}

	fetchIcons() {
		ajax.getIconLibrary(this.props.ajax_option)
			.done((options) => {
				if (!this.mounted) {
					return;
				}
				ICON_LIBRARIES[this.props.ajax_option] = options;
				this.setState({
					loading: false,
					options,
				});
			})
			.fail(() => {
				console.error('Error fetching icons');
			});
	}

	getInitialOptions() {
		return _.isArray(ICON_LIBRARIES[this.props.ajax_option]) ? ICON_LIBRARIES[this.props.ajax_option] : this.props.options;
	}

	needsToFetchIcons() {
		return this.props.ajax_option.length && !ICON_LIBRARIES[this.props.ajax_option];
	}

	render() {
		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});

		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});
		const containerClasses = classNames({
			'panel-icon-container': true,
			[styles.container]: true,
		});
		const searchClasses = classNames({
			'panel-icon-search': true,
			[styles.searchWrapper]: true,
		});
		const fieldClasses = classNames({
			[styles.field]: true,
			[styles.categoryMode]: this.state.mode === 'categorized',
			'panel-field': true,
			'panel-conditional-field': true,
		});

		return (
			<div className={fieldClasses}>
				<label className={labelClasses}>
					{this.props.label}
				</label>
				{this.state.value.length > 0 && this.getSelectedIcon()}
				{this.props.search && <div className={searchClasses}>
					<input className={styles.search} value={this.state.search} onChange={this.handleSearch} placeholder={this.props.strings['placeholder.search']} />
				</div>}
				<div className={containerClasses}>
					{this.state.loading &&
					<div className={styles.loaderWrap}>
						<div className={styles.loading}><Loader active /></div>
					</div>
					}
					{this.state.mode === 'categorized' && this.getCategorizedOptions()}
					{this.state.mode === 'single' && this.getSingleOptions()}
				</div>
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

Icons.propTypes = {
	ajax_option: PropTypes.string,
	categories: PropTypes.object,
	label: PropTypes.string,
	class_string: PropTypes.string,
	icon_prefix: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.object,
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	depth: PropTypes.number,
	default: PropTypes.string,
	options: PropTypes.array,
	data: PropTypes.string,
	search: PropTypes.bool,
	panelIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
};

Icons.defaultProps = {
	ajax_option: '',
	categories: {},
	label: '',
	class_string: 'icon %s',
	icon_prefix: '',
	name: '',
	description: '',
	indexMap: [],
	parentMap: [],
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
