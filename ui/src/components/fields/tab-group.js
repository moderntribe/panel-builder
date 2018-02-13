import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import autobind from 'autobind-decorator';

import Tab from './tab';

import styles from './group.pcss';

/**
 * Class TabGroup
 *
 * A container for a group of fields laid out in a tabbed ui.
 *
 */

class TabGroup extends Component {
	state = {
		activeTab: this.props.fields[0].name,
	};

	getTabs() {
		return this.props.fields.map(tab => (
			<li
				key={_.uniqueId('tab-id-')}
			>
				<button>
					{tab.icon.length ? <img src={tab.icon} alt="" /> : tab.label}
				</button>
			</li>
		));
	}

	/**
	 * Gets the header which toggles the active tab
	 * @returns {XML}
	 */

	getHeader() {
		const headerClasses = classNames({
			[styles.header]: true,
			'panel-tab-header': true,
		});

		return (
			<div className={headerClasses}>
				<ul>{this.getTabs()}</ul>
			</div>
		);
	}

	/**
	 * Gets the fields, called when state is active.
	 * @returns {XML}
	 */

	renderActiveTab() {
		const tab = this.props.fields.filter(field => field.name === this.state.activeTab);
		const parentMap = this.props.parentMap.slice();
		parentMap.push(this.props.name);
		const fieldClasses = classNames({
			[styles.fields]: true,
			'panel-tab-group-fields': true,
		});

		return (
			<div className={fieldClasses}>
				<Tab
					fields={tab[0].fields}
					parentMap={parentMap}
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
				{this.getHeader()}
				{this.renderActiveTab()}
			</div>
		);
	}
}

TabGroup.propTypes = {
	data: PropTypes.object,
	default: PropTypes.array,
	depth: PropTypes.number,
	description: PropTypes.string,
	fields: PropTypes.array,
	handleExpanderClick: PropTypes.func,
	hidePanel: PropTypes.func,
	indexMap: PropTypes.array,
	parentMap: PropTypes.array,
	label: PropTypes.string,
	liveEdit: PropTypes.bool,
	name: PropTypes.string,
	nestedGroupActive: PropTypes.func,
	panelIndex: PropTypes.number,
	panelLabel: PropTypes.string,
	parentIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
};

TabGroup.defaultProps = {
	data: {},
	default: [],
	depth: 0,
	description: '',
	fields: [],
	handleExpanderClick: () => {},
	hidePanel: () => {},
	indexMap: [],
	parentMap: [],
	label: '',
	liveEdit: false,
	name: '',
	nestedGroupActive: () => {},
	panelIndex: 0,
	panelLabel: '',
	parentIndex: 0,
	updatePanelData: () => {},
};

export default TabGroup;
