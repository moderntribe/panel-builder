import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import autobind from 'autobind-decorator';

import Tab from './tab';

import styles from './tab-group.pcss';
import * as panelConditionals from '../../util/dom/panel-conditionals';
import * as domTools from '../../util/dom/tools';
import { trigger } from '../../util/events';
import { IFRAME_CHANGE_VIEWPORT } from '../../constants/events';

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

	@autobind
	handleTabClick(e) {
		const target = e.currentTarget;
		this.setState({
			activeTab: target.dataset.name,
		}, () => {
			panelConditionals.initConditionalFields(domTools.closest(this.tab, '[data-panel]'));
			if (target.dataset.viewport && target.dataset.viewport.length) {
				trigger({ event: IFRAME_CHANGE_VIEWPORT, native: false, data: { viewport: target.dataset.viewport } });
			}
		});
	}

	getTabs() {
		return this.props.fields.map((tab) => {
			const liClasses = classNames({
				[styles.tab]: true,
				[styles.tabActive]: tab.name === this.state.activeTab,
			});
			const iconClasses = classNames({
				[styles.icon]: true,
				[styles.iconSvg]: tab.icon.substr(tab.icon.lastIndexOf('.') + 1) === 'svg',
			});
			return (
				<li
					key={_.uniqueId('tab-id-')}
					className={liClasses}
				>
					<button
						className={styles.tabButton}
						onClick={this.handleTabClick}
						data-name={tab.name}
						data-viewport={tab.viewport}
						type="button"
					>
						{tab.icon.length ? <img src={tab.icon} className={iconClasses} alt="" /> : tab.label}
					</button>
				</li>
			);
		});
	}

	/**
	 * Gets the header which toggles the active tab
	 * @returns {XML}
	 */

	getHeader() {
		return (
			<div className={styles.header}>
				<ul className={styles.tabList}>{this.getTabs()}</ul>
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

		return (
			<Tab
				fields={tab[0].fields}
				name={tab[0].name}
				data={this.props.data[tab[0].name]}
				parent={this.props.name}
				parentMap={parentMap}
				depth={this.props.depth}
				index={this.props.panelIndex}
				indexMap={this.props.indexMap}
				updatePanelData={this.props.updatePanelData}
			/>
		);
	}

	render() {
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
			'tab-group-field': true,
		});

		return (
			<div className={fieldClasses} ref={r => this.tab = r}>
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
