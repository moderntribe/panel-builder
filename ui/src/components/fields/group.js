import React, { Component } from 'react';
import PropTypes from 'prop-types';
import striptags from 'striptags';
import classNames from 'classnames';
import autobind from 'autobind-decorator';

import LabelTooltip from './partials/label-tooltip';
import FieldBuilder from '../shared/field-builder';
import AccordionBack from '../shared/accordion-back';
import * as DATA_KEYS from '../../constants/data-keys';

import styles from './group.pcss';

/**
 * Class Group
 *
 * A container for a group of fields. It wraps fields in the admin
 * in a accordion to show logical groupings.
 *
 */

class Group extends Component {
	state = {
		active: false,
	};

	/**
	 * Gets the header which toggles the group into view
	 * @returns {XML}
	 */

	getHeader() {
		const headerClasses = classNames({
			[styles.header]: true,
			'panel-row-header': true,
		});
		const arrowClasses = classNames({
			'dashicons': true,
			[styles.arrow]: true,
			'panel-row-arrow': true,
			'dashicons-arrow-right-alt2': true,
		});

		return (
			<div
				className={headerClasses}
				onClick={this.handleHeaderClick}
			>
				<h3>{striptags(this.props.label)}</h3>
				<i className={arrowClasses} />
			</div>
		);
	}

	/**
	 * Gets the fields, called when state is active.
	 * @returns {XML}
	 */

	@autobind
	getFields() {
		const fieldClasses = classNames({
			[styles.fields]: true,
			'panel-group-fields': true,
		});

		const parentMap = this.props.parentMap.slice();
		parentMap.push(this.props.name);

		return (
			<div className={fieldClasses}>
				{!this.isCompact() &&
					<AccordionBack
						title={this.props.label}
						panelLabel={this.props.panelLabel}
						handleClick={this.handleBackClick}
						handleExpanderClick={this.props.handleExpanderClick}
					/>
				}
				<div className={styles.fieldWrap}>
					<FieldBuilder
						fields={this.props.fields}
						data={this.props.data}
						parent={this.props.name}
						parentMap={parentMap}
						index={this.props.panelIndex}
						indexMap={this.props.indexMap}
						updatePanelData={this.props.updatePanelData}
					/>
				</div>
			</div>
		);
	}

	isCompact() {
		return this.props.layout === DATA_KEYS.COMPACT_LAYOUT;
	}

	/**
	 * Handles the header click and toggles fields into/out of view.
	 */

	@autobind
	handleHeaderClick() {
		if (this.props.liveEdit) {
			this.props.hidePanel(true);
			this.props.nestedGroupActive(true);
		}
		this.setState({
			active: !this.state.active,
		});
	}

	/**
	 * Handles sending us back to the panel from viewing an added row. Communicates with panel parent.
	 */

	@autobind
	handleBackClick() {
		this.props.hidePanel(false);
		this.props.nestedGroupActive(false);
		this.setState({
			active: false,
		});
	}

	render() {
		const fieldClasses = classNames({
			[styles.field]: true,
			[styles.compact]: this.isCompact(),
			'panel-field': true,
			'group-field': true,
		});

		const labelClasses = classNames({
			[styles.label]: true,
			'panel-field-label': true,
		});

		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});

		return this.props.layout === 'compact' ? (
			<div className={fieldClasses} data-group-active="true">
				<label className={labelClasses}>
					{this.props.label}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>
				{this.getFields()}
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		) : (
			<div className={fieldClasses} data-group-active={this.state.active}>
				{this.getHeader()}
				{this.state.active ? this.getFields() : null}
			</div>
		);
	}
}

Group.propTypes = {
	depth: PropTypes.number,
	layout: PropTypes.string,
	parentIndex: PropTypes.number,
	data: PropTypes.object,
	panelIndex: PropTypes.number,
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	panelLabel: PropTypes.string,
	fields: PropTypes.array,
	label: PropTypes.string,
	description: PropTypes.string,
	liveEdit: PropTypes.bool,
	name: PropTypes.string,
	default: PropTypes.array,
	nestedGroupActive: PropTypes.func,
	updatePanelData: PropTypes.func,
	hidePanel: PropTypes.func,
	handleExpanderClick: PropTypes.func,
};

Group.defaultProps = {
	depth: 0,
	layout: 'full',
	parentIndex: 0,
	indexMap: [],
	parentMap: [],
	data: {},
	panelIndex: 0,
	panelLabel: '',
	fields: [],
	label: '',
	description: '',
	liveEdit: false,
	name: '',
	default: [],
	nestedGroupActive: () => {},
	updatePanelData: () => {},
	hidePanel: () => {},
	handleExpanderClick: () => {},
};

export default Group;
