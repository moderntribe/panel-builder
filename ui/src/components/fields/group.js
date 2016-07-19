import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import autobind from 'autobind-decorator';

import FieldBuilder from '../shared/field-builder';
import AccordionBack from '../shared/accordion-back';

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
			dashicons: true,
			[styles.arrow]: true,
			'panel-row-arrow': true,
			'dashicons-arrow-right-alt2': true,
		});

		return (
			<div
				className={headerClasses}
				onClick={this.handleHeaderClick}
			>
				<h3>{this.props.label}</h3>
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

		return (
			<div className={fieldClasses}>
				<AccordionBack
					title={this.props.label}
					panelLabel={this.props.panelLabel}
					handleClick={this.handleBackClick}
					handleExpanderClick={this.props.handleExpanderClick}
				/>
				<FieldBuilder
					fields={this.props.fields}
					data={this.props.data}
					parent={this.props.name}
					index={this.props.panelIndex}
					updatePanelData={this.updateGroupFieldData}
				/>
			</div>
		);
	}

	/**
	 * Updates group field data in redux store, needs parent key sent along
	 * @param data
	 */

	@autobind
	updateGroupFieldData(data) {
		this.props.updatePanelData({
			index: data.index,
			name: data.name,
			value: data.value,
			parent: this.props.name,
		});
	}

	/**
	 * Handles the header click and toggles fields into/out of view.
	 */

	@autobind
	handleHeaderClick() {
		this.props.hidePanel(true);
		this.setState({
			active: true,
		});
	}

	/**
	 * Handles sending us back to the panel from viewing an added row. Communicates with panel parent.
	 */

	@autobind
	handleBackClick() {
		this.props.hidePanel(false);
		this.setState({
			active: false,
		});
	}

	render() {
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
			'group-field': true,
		});

		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});

		return (
			<div className={fieldClasses}>
				{this.getHeader()}
				{this.state.active ? this.getFields() : null}
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}

}

Group.propTypes = {
	data: PropTypes.object,
	panelIndex: PropTypes.number,
	panelLabel: PropTypes.string,
	fields: PropTypes.array,
	label: PropTypes.string,
	description: PropTypes.string,
	name: PropTypes.string,
	default: PropTypes.array,
	updatePanelData: PropTypes.func,
	hidePanel: PropTypes.func,
	handleExpanderClick: PropTypes.func,
};

Group.defaultProps = {
	data: {},
	panelIndex: 0,
	panelLabel: '',
	fields: [],
	label: '',
	description: '',
	name: '',
	default: [],
	updatePanelData: () => {},
	hidePanel: () => {},
	handleExpanderClick: () => {},
};

export default Group;
