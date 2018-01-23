import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import Polyglot from 'node-polyglot';
import Sortable from 'react-sortablejs';
import zenscroll from 'zenscroll';
import _ from 'lodash';
import striptags from 'striptags';

import Button from '../shared/button';
import FieldBuilder from '../shared/field-builder';
import AccordionBack from '../shared/accordion-back';

import arrayMove from '../../util/data/array-move';
import randomString from '../../util/data/random-string';
import * as defaultData from '../../util/data/default-data';
import * as EVENTS from '../../constants/events';
import * as FINDLAW from '../../constants/findlaw';
import * as AdminCache from '../../util/data/admin-cache';
import { trigger } from '../../util/events';

import styles from './repeater.pcss';
import { PERMISSIONS } from '../../globals/config';
import { UI_I18N } from '../../globals/i18n';

zenscroll.setup(200, 40);

/**
 * Class Repeater
 *
 * A repeatable container for a group of fields. The Repeater can
 * contain one or more fields. An editor can add, remove, or sort
 * instances of the group.
 *
 * Using data from a repeater in a template:
 *
 * $contacts = get_panel_var( 'contacts' );
 * foreach ( $contacts as $contact ) {
 *   $name = $contact['name'];
 *   $email = $contact['email'];
 * }
 *
 */

class Repeater extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			activeIndex: 0,
			data: this.getPaddedFieldData(),
			keyPrefix: randomString(10),
			sorting: false,
		};
		this.el = null;
	}

	/**
	 * On init of the field, state uses this to add empty objects to the existing data array if needed to make sure
	 * we print the min amount of required fields.
	 *
	 * @returns {*}
	 */

	getPaddedFieldData() {
		let target = JSON.parse(JSON.stringify(this.props.panels));
		this.props.indexMap.forEach((val, i) => {
			if (!target) {
				return;
			}
			target = (i + 1) === this.props.indexMap.length ? target[val] : target[val].panels;
		});
		let store;
		if (this.props.parent.length) {
			store = target && target.data ? target.data[this.props.parent][this.props.name] : {};
		} else {
			store = target && target.data ? target.data[this.props.name] : {};
		}
		const fieldData = !_.isEmpty(store) ? store : [];
		let shouldUpdate = false;
		if (fieldData.length < this.props.min) {
			const remaining = this.props.min - fieldData.length;
			_.times(remaining, () =>
				fieldData.push(defaultData.repeater(this.props.fields)),
			);
			shouldUpdate = true;
		}

		if (shouldUpdate) {
			this.props.updatePanelData({
				depth: this.props.depth,
				index: this.props.panelIndex,
				indexMap: this.props.indexMap,
				name: this.props.name,
				value: fieldData,
			});
		}

		return fieldData;
	}

	getRowIndexLabel(index) {
		const polyglot = new Polyglot();
		polyglot.extend({
			row_index: this.props.strings['label.row_index'],
		});
		return polyglot.t('row_index', { index: index + 1, smart_count: index + 1 });
	}

	/**
	 * Uses Fieldbuilder and Button to generate an accordion hidden field group which is animated into place.
	 *
	 * @returns {XML}
	 */

	@autobind
	getActiveRow() {
		const rowData = this.state.data[this.state.activeIndex] ? this.state.data[this.state.activeIndex] : {};
		const rowIndexLabel = this.getRowIndexLabel(this.state.activeIndex);
		const title = rowData.title && rowData.title.length ? rowData.title : rowIndexLabel;
		const deleteLabel = this.props.strings['button.delete'];
		const fieldClasses = classNames({
			[styles.fields]: true,
			'panel-row-fields': true,
		});

		return (
			<div className={fieldClasses} data-group="repeater-fields">
				<AccordionBack
					title={title}
					panelLabel={this.props.panelLabel}
					handleClick={this.handleBackClick}
					handleExpanderClick={this.props.handleExpanderClick}
				/>
				<div className={styles.fieldWrap}>
					{PERMISSIONS.can_edit_panel_settings && this.renderSettingsToggle()}
					<FieldBuilder
						fields={this.props.fields}
						settings_fields={this.props.settings_fields}
						data={rowData}
						parent={this.props.name}
						index={this.props.panelIndex}
						indexMap={this.props.indexMap}
						updatePanelData={this.updateRepeaterFieldData}
					/>
					{PERMISSIONS.can_delete_rows && <Button
						icon="dashicons-trash"
						text={deleteLabel}
						bare
						full={false}
						classes={styles.deleteRow}
						handleClick={this.handleDeleteRow}
					/>}
				</div>
			</div>
		);
	}

	/**
	 * Prints all headers which trigger accordions with an index used to activate their targets when clicked.
	 * Will be hooked up to sorting on the sort ticket.
	 *
	 * @param data The data if any for this row
	 * @param index The index for this row
	 * @returns {XML}
	 */

	getHeader(data = {}, index) {
		const rowIndexLabel = this.getRowIndexLabel(index);
		const title = data.title && data.title.length ? data.title : rowIndexLabel;
		const headerClasses = classNames({
			[styles.header]: true,
			'panel-row-header': true,
			'repeater-header': true,
			[styles.hasIcon]: data[FINDLAW.FIELD_ICON_LIBRARY] || data[FINDLAW.FIELD_ICON_ICON_IMAGE],
		});
		const arrowClasses = classNames({
			'dashicons': true,
			[styles.arrow]: true,
			'panel-row-arrow': true,
			'dashicons-arrow-right-alt2': true,
		});

		return (
		this.props.liveEdit ?
			<div
				key={`${this.state.keyPrefix}-${index}`}
				data-row-index={index}
				className={headerClasses}
				onClick={this.handleHeaderClick}
			>
				{this.maybeGetIcon(data)}
				<h3 className={styles.rowHeading}>{striptags(title)}</h3>
				<i className={arrowClasses} />
			</div> : <div data-row-active={this.state.active && index === this.state.activeIndex} key={`${this.state.keyPrefix}-${index}`}>
				<div
					data-row-index={index}
					className={headerClasses}
					onClick={this.handleHeaderClick}
				>
					{this.maybeGetIcon(data)}
					<h3 className={styles.rowHeading}>{striptags(title)}</h3>
					<i className={arrowClasses} />
				</div>
				{this.state.active && index === this.state.activeIndex ? this.getActiveRow() : null}
			</div>
		);
	}

	/**
	 * Maps data to header jsx.
	 *
	 * @returns {Array}
	 */

	@autobind
	getHeaders() {
		const sortOptions = {
			animation: 150,
			handle: '.repeater-header',
			onSort: (e) => {
				this.handleSort(e);
			},
		};

		const Headers = _.map(this.state.data, (data, i) => this.getHeader(data, i));

		return PERMISSIONS.can_sort_rows ? (
			<Sortable
				options={sortOptions}
			>
				{Headers}
			</Sortable>
		) : <div>{Headers}</div>;
	}

	/**
	 * Gets the add row button or a message if max is hit.
	 *
	 * @returns {*}
	 */

	@autobind
	getAddRow() {
		let AddRow = null;
		if (this.state.data.length < this.props.max && PERMISSIONS.can_add_rows) {
			AddRow = (
				<Button
					icon="dashicons-plus-alt"
					classes="repeater-add-row"
					text={this.props.strings['button.new']}
					primary={false}
					full={false}
					handleClick={this.handleAddRow}
					rounded
				/>
			);
		} else {
			AddRow = <p className={styles.maxMessage}>{this.props.strings['button.max_rows']}</p>;
		}
		return AddRow;
	}

	maybeGetIcon(data = {}) {
		if (!data[FINDLAW.FIELD_ICON_LIBRARY] && !data[FINDLAW.FIELD_ICON_ICON_IMAGE]) {
			return null;
		}
		const iconClasses = classNames({
			fa: true,
			[data[FINDLAW.FIELD_ICON_LIBRARY]]: true,
			[styles.iconIcon]: true,
		});
		return data[FINDLAW.FIELD_ICON_ICON_IMAGE] !== 0 ? (
			<span className={styles.iconWrap}>
				<img className={styles.iconImage} src={AdminCache.getImageSrcById(data[FINDLAW.FIELD_ICON_ICON_IMAGE])} alt="" />
			</span>
		) : (
			<span className={styles.iconWrap}>
				<i className={iconClasses} />
			</span>
		);
	}

	handleSort(e) {
		const data = arrayMove(this.state.data, e.oldIndex, e.newIndex);
		this.setState({
			active: false,
			keyPrefix: randomString(10),
			data,
		});
		const updateData = {
			depth: this.props.depth,
			index: this.props.panelIndex,
			rowIndex: e.newIndex,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value: data,
		};
		this.props.updatePanelData(updateData);
		trigger({
			event: EVENTS.REPEATER_ROW_MOVED,
			native: false,
			data: updateData,
		});
	}

	/**
	 * Uses splice to remove the activeIndex row, udpates state, reveals the parent panel at scroll point
	 * and updates the redux store for this repeater instance with row removed.
	 */

	@autobind
	handleDeleteRow() {
		const data = this.state.data;
		data.splice(this.state.activeIndex, 1);
		this.props.hidePanel(false);
		this.props.nestedGroupActive(false);
		this.setState({
			active: false,
			activeIndex: 0,
			data,
		});
		const updateData = {
			depth: this.props.depth,
			index: this.props.panelIndex,
			rowIndex: this.state.activeIndex,
			indexMap: this.props.indexMap,
			name: this.props.name,
			value: data,
		};
		this.props.updatePanelData(updateData);
		trigger({
			event: EVENTS.REPEATER_ROW_DELETED,
			native: false,
			data: updateData,
		});
	}

	scrollToActive() {
		if (!this.props.liveEdit && this.state.active) {
			zenscroll.to(this.el.querySelectorAll('[data-row-active="true"]')[0]);
		}
	}

	/**
	 * Pushes an empty object onto state which triggers a re render with a new panel row in place :)
	 */

	@autobind
	handleAddRow() {
		const newState = this.state;
		newState.data.push(defaultData.repeater(this.props.fields));
		newState.active = true;
		newState.activeIndex = newState.data.length - 1;
		if (this.props.liveEdit) {
			this.props.hidePanel(true);
			this.props.nestedGroupActive(true);
		}
		this.setState(newState, () => {
			const data = {
				depth: this.props.depth,
				index: this.props.panelIndex,
				rowIndex: newState.activeIndex,
				indexMap: this.props.indexMap,
				name: this.props.name,
				value: newState.data,
			};
			this.props.updatePanelData(data);
			this.scrollToActive();
			trigger({
				event: EVENTS.REPEATER_ROW_ADDED,
				native: false,
				data,
			});
		});
	}

	/**
	 * Handles telling parent panel to hide while animating in the row. Does this by manipulating state, so only the row
	 * we need is ever rendered.
	 *
	 * @param e
	 */

	@autobind
	handleHeaderClick(e) {
		const activeIndex = parseInt(e.currentTarget.getAttribute('data-row-index'), 10);
		const newState = {
			activeIndex,
		};
		if (this.props.liveEdit) {
			this.props.hidePanel(true);
			this.props.nestedGroupActive(true);
		}
		if (this.state.active && activeIndex === this.state.activeIndex) {
			newState.active = false;
		} else {
			newState.active = true;
		}
		this.setState(newState, () => {
			const event = newState.active ? EVENTS.REPEATER_ROW_ACTIVATED : EVENTS.REPEATER_ROW_DEACTIVATED;
			const data = {
				rowIndex: activeIndex,
				depth: this.props.depth,
				index: this.props.panelIndex,
				name: this.props.name,
				value: this.state.data,
			};
			this.scrollToActive();
			trigger({
				event,
				native: false,
				data,
			});
		});
	}

	/**
	 * Handles sending us back to the panel from viewing an added row. Communicates with panel parent.
	 */

	@autobind
	handleBackClick() {
		const data = {
			rowIndex: this.state.activeIndex,
			depth: this.props.depth,
			index: this.props.panelIndex,
			name: this.props.name,
			value: this.state.data,
		};
		this.props.hidePanel(false);
		this.props.nestedGroupActive(false);
		trigger({
			event: EVENTS.REPEATER_ROW_DEACTIVATED,
			native: false,
			data,
		});
		this.setState({
			active: false,
			activeIndex: 0,
		});
	}

	/**
	 * Handles receiving data from field updates and updating redux store to update database
	 *
	 * @param data passed up from the field
	 */

	@autobind
	updateRepeaterFieldData(data) {
		const newData = this.state.data;
		if (data.parent) {
			const parentData = newData[this.state.activeIndex][data.parent];
			newData[this.state.activeIndex][data.parent] = _.isPlainObject(parentData) ? parentData : {};
			newData[this.state.activeIndex][data.parent][data.name] = data.value;
		} else {
			newData[this.state.activeIndex][data.name] = data.value;
		}
		this.props.updatePanelData({
			depth: this.props.depth,
			index: this.props.panelIndex,
			indexMap: this.props.indexMap,
			childIndex: this.state.activeIndex,
			childName: data.name,
			childValue: data.value,
			name: this.props.name,
			value: newData,
		});
		trigger({
			event: EVENTS.REPEATER_ROW_UPDATED,
			native: false,
			data: {
				rowIndex: this.state.activeIndex,
				depth: this.props.depth,
				index: this.props.panelIndex,
				name: this.props.name,
				value: this.state.data,
			},
		});
	}

	@autobind
	enableSettingsMode() {
		this.el.classList.add(styles.settingsActive);
	}

	@autobind
	enableContentMode() {
		this.el.classList.remove(styles.settingsActive);
	}

	renderSettingsToggle() {
		return this.props.settings_fields.length ? (
			<div className={styles.settings}>
				<Button
					text={UI_I18N['tab.content']}
					full={false}
					classes={styles.contentButton}
					handleClick={this.enableContentMode}
				/>
				<Button
					text={UI_I18N['tab.settings']}
					full={false}
					classes={styles.settingsButton}
					handleClick={this.enableSettingsMode}
				/>
			</div>
		) : null;
	}

	render() {
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
			'repeater-field': true,
		});

		const legendClasses = classNames({
			[styles.label]: true,
			'panel-field-legend': true,
		});

		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-field-description': true,
		});

		return (
			<div ref={r => this.el = r} className={fieldClasses} data-depth={this.props.depth} data-active={this.state.active}>
				<label className={legendClasses}>{this.props.label}</label>
				{this.getHeaders()}
				{this.state.active && this.props.liveEdit ? this.getActiveRow() : null}
				{this.getAddRow()}
				<p className={descriptionClasses}>{this.props.description}</p>
			</div>
		);
	}
}

const mapStateToProps = state => ({ panels: state.panelData.panels });

Repeater.propTypes = {
	data: PropTypes.array,
	depth: PropTypes.number,
	panels: PropTypes.array,
	parent: PropTypes.string,
	parentIndex: PropTypes.number,
	panelLabel: PropTypes.string,
	panelIndex: PropTypes.number,
	indexMap: PropTypes.array,
	fields: PropTypes.array,
	strings: PropTypes.object,
	label: PropTypes.string,
	description: PropTypes.string,
	liveEdit: PropTypes.bool,
	name: PropTypes.string,
	default: PropTypes.array,
	settings_fields: PropTypes.array,
	updatePanelData: PropTypes.func,
	hidePanel: PropTypes.func,
	nestedGroupActive: PropTypes.func,
	handleExpanderClick: PropTypes.func,
	type: PropTypes.string,
	min: PropTypes.number,
	max: PropTypes.number,
};

Repeater.defaultProps = {
	data: [],
	depth: 0,
	parent: '',
	parentIndex: 0,
	panels: [],
	panelIndex: 0,
	indexMap: [],
	panelLabel: '',
	fields: [],
	strings: {},
	label: '',
	description: '',
	liveEdit: false,
	name: '',
	default: [],
	settings_fields: [],
	updatePanelData: () => {},
	nestedGroupActive: () => {},
	handleExpanderClick: () => {},
	hidePanel: () => {},
	type: '',
	min: 1,
	max: 12,
};

export default connect(mapStateToProps)(Repeater);
