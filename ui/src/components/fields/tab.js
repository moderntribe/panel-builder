import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autobind from 'autobind-decorator';

import FieldBuilder from '../shared/field-builder';

import styles from './group.pcss';

/**
 * Class TabGroup
 *
 * A container for a group of fields laid out in a tabbed ui.
 *
 */

class Tab extends Component {
	state = {
		activeTab: this.props.fields[0].name,
	};

	/**
	 * Gets the header which toggles the group into view
	 * @returns {XML}
	 */

	getHeader() {
		const headerClasses = classNames({
			[styles.header]: true,
			'panel-tab-header': true,
		});

		return <div className={headerClasses}>Header</div>;
	}

	/**
	 * Gets the fields, called when state is active.
	 * @returns {XML}
	 */

	renderActiveTab() {
		const fieldClasses = classNames({
			[styles.fields]: true,
			'panel-group-fields': true,
		});

		return (
			<div className={fieldClasses}>
				<FieldBuilder
					fields={this.props.fields}
					data={this.props.data}
					parent={this.props.name}
					index={this.props.panelIndex}
					indexMap={this.props.indexMap}
					updatePanelData={this.props.updatePanelData}
				/>
			</div>
		);
	}

	render() {
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
			'tab-group-field': true,
		});

		return (
			<div className={fieldClasses}>
				{this.renderActiveTab()}
			</div>
		);
	}
}

Tab.propTypes = {
	data: PropTypes.object,
	default: PropTypes.array,
	depth: PropTypes.number,
	description: PropTypes.string,
	fields: PropTypes.array,
	handleExpanderClick: PropTypes.func,
	hidePanel: PropTypes.func,
	indexMap: PropTypes.array,
	label: PropTypes.string,
	liveEdit: PropTypes.bool,
	name: PropTypes.string,
	nestedGroupActive: PropTypes.func,
	panelIndex: PropTypes.number,
	panelLabel: PropTypes.string,
	parentIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
};

Tab.defaultProps = {
	data: {},
	default: [],
	depth: 0,
	description: '',
	fields: [],
	handleExpanderClick: () => {},
	hidePanel: () => {},
	indexMap: [],
	label: '',
	liveEdit: false,
	name: '',
	nestedGroupActive: () => {},
	panelIndex: 0,
	panelLabel: '',
	parentIndex: 0,
	updatePanelData: () => {},
};

export default Tab;
