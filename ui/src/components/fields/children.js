import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import striptags from 'striptags';
import deepAssign from 'deep-assign';
import Sortable from 'react-sortablejs';
import zenscroll from 'zenscroll';
import _ from 'lodash';

import Button from '../shared/button';
import LabelTooltip from './partials/label-tooltip';
import Panel from '../panel';
import AccordionBack from '../shared/accordion-back';
import PanelPicker from '../panel-picker';
import { updatePanelData } from '../../actions/panels';

import arrayMove from '../../util/data/array-move';
import randomString from '../../util/data/random-string';
import * as defaultData from '../../util/data/default-data';
import * as tools from '../../util/dom/tools';
import * as panelConditionals from '../../util/dom/panel-conditionals';
import * as EVENTS from '../../constants/events';
import * as FINDLAW from '../../constants/findlaw';
import { trigger } from '../../util/events';

import { UI_I18N } from '../../globals/i18n';

import styles from './children.pcss';
import { PERMISSIONS } from '../../globals/config';

zenscroll.setup(200, 40);

/**
 * Class Children
 *
 * A repeatable container for a group of panels. An editor can add, remove, or sort
 * instances of the group.
 *
 */

class Children extends Component {
	constructor(props) {
		super(props);
		this.childData = deepAssign({
			label: {
				plural: 'Panels',
				singular: 'Panel',
				add: 'Add Panel',
				delete: 'Delete panel',
			},
			max: 0,
			types: {},
		}, this.props.childData);

		this.state = {
			active: false,
			activeIndex: 0,
			childDepth: this.props.depth + 1,
			data: this.props.data.filter(p => p.depth === (this.props.depth + 1)),
			pickerActive: false,
			keyPrefix: randomString(10),
			sorting: false,
			types: _.values(this.childData.types),
		};
		this.el = null;
		this.handleColumnInjection = this.handleColumnInjection.bind(this);
	}

	componentDidMount() {
		this.el = this.childPanels;
		document.addEventListener(EVENTS.COLUMNS_UPDATED, this.handleColumnInjection);
	}

	componentWillUnmount() {
		document.removeEventListener(EVENTS.COLUMNS_UPDATED, this.handleColumnInjection);
	}

	setChildActiveClass() {
		const parentGroup = tools.closest(this.el, '.children-field');
		if (parentGroup) {
			parentGroup.classList.add(styles.childActive);
		}
	}

	/**
	 * Uses AccordionBack, Panel and Button to generate an accordion hidden field group which is animated into place.
	 *
	 * @returns {XML}
	 */

	@autobind
	getActiveRow() {
		const rowData = this.state.data[this.state.activeIndex] ? this.state.data[this.state.activeIndex] : {};
		const title = rowData.data.title && rowData.data.title.length ? rowData.data.title : `${this.childData.label.singular} ${this.state.activeIndex + 1}`;
		const deleteLabel = `${this.childData.label.delete}`;
		const blueprint = _.find(this.state.types, { type: rowData.type });
		const fieldClasses = classNames({
			[styles.fields]: true,
			'panel-row-fields': true,
		});

		return (
			<div ref={r => this.fields = r} className={fieldClasses}>
				<AccordionBack
					title={title}
					panelLabel={blueprint.label}
					handleClick={this.handleBackClick}
					handleInfoClick={this.handleInfoClick}
					handleExpanderClick={this.props.handleExpanderClick}
				/>
				<Panel
					{...blueprint}
					{...this.state.data[this.state.activeIndex]}
					key={`${this.state.keyPrefix}-${this.state.activeIndex}`}
					index={this.state.activeIndex}
					panelIndex={this.state.activeIndex}
					parentIndex={this.props.parentIndex}
					indexMap={this.props.indexMap}
					classesWrapper={styles.childPanels}
					classesFields={styles.childPanelsFields}
					liveEdit={this.props.liveEdit}
					depth={this.state.childDepth}
					panelsActive
					active
					nestedGroupActive={this.handleNestedGroups}
					updatePanelData={this.handleDataUpdate}
					handleExpanderClick={this.props.handleExpanderClick}
				/>
				{PERMISSIONS.can_delete_child_panels && <Button
					icon="dashicons-trash"
					text={deleteLabel}
					bare
					full={false}
					classes={styles.deleteRow}
					handleClick={this.handleDeleteRow}
				/>}
			</div>
		);
	}

	getColumnWidth(data = {}) {
		if (!data[FINDLAW.FIELD_COLUMN_WIDTH]) {
			return null;
		}
		return _.times(data[FINDLAW.FIELD_COLUMN_WIDTH], () => (
			<span className={styles.columnWidthItem} key={_.uniqueId('column-display-')} />
		));
	}

	getSubtitle(data = {}, blueprint = {}) {
		return data.type !== FINDLAW.TYPE_COLUMN ? (
			<span className={styles.typeHeading}>({blueprint.label})</span>
		) : (
			<span className={styles.columnWidthDisplay}>{this.getColumnWidth(data.data)}</span>
		);
	}

	/**
	 * Prints all headers which trigger accordions with an index used to activate their targets when clicked.
	 *
	 * @param data The data if any for this row
	 * @param index The index for this row
	 * @returns {XML}
	 */

	getHeader(data = {}, index) {
		const dataTitle = data.data.title;
		const rowIndex = data.type === FINDLAW.TYPE_COLUMN ? ` ${index + 1}` : '';
		const title = dataTitle && dataTitle.length ? dataTitle : `${this.childData.label.singular}${rowIndex}`;
		const blueprint = _.find(this.state.types, { type: data.type });
		if (!blueprint) {
			return null;
		}
		const headerClasses = classNames({
			[styles.header]: true,
			'panel-row-header': true,
			'children-header': true,
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
				<h3 className={styles.rowHeading}>
					{striptags(title)}
					{this.getSubtitle(data, blueprint)}
				</h3>
				<i className={arrowClasses} />
			</div> : <div data-row-active={this.state.active && index === this.state.activeIndex} key={`${this.state.keyPrefix}-${index}`}>
				<div
					data-row-index={index}
					className={headerClasses}
					onClick={this.handleHeaderClick}
				>
					<h3 className={styles.rowHeading}>
						{striptags(title)}
						{this.getSubtitle(data, blueprint)}
					</h3>
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
			handle: '.children-header',
			onSort: (e) => {
				this.handleSort(e);
			},
		};

		const Headers = _.map(this.state.data, (data, i) => this.getHeader(data, i));

		return PERMISSIONS.can_sort_child_panels ? (
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
		if (this.state.data.length < this.childData.max && PERMISSIONS.can_add_child_panels) {
			const classes = classNames({
				'children-add-row': true,
				[styles.addRow]: true,
			});
			AddRow = (
				<Button
					icon="dashicons-plus-alt"
					classes={classes}
					text={`${this.childData.label.add}`}
					primary={false}
					full={false}
					handleClick={this.handleLaunchPicker}
					rounded
				/>
			);
		}

		return AddRow;
	}

	getPicker() {
		return (
			<PanelPicker
				child
				activate
				addNewText={UI_I18N['button.child_add_new']}
				cancelText={UI_I18N['button.child_cancel_add_new']}
				handlePickerUpdate={this.handlePickerUpdate}
				classes={styles.childPicker}
				handleAddPanel={this.handleAddRow}
				types={this.state.types}
			/>
		);
	}

	handleColumnInjection() {
		this.setState({
			active: false,
			data: this.props.panels[this.props.indexMap[0]].panels,
		});
	}

	@autobind
	handleInfoClick() {
		if (this.el.getAttribute('data-info-active') === 'false') {
			this.el.setAttribute('data-info-active', 'true');
		} else {
			this.el.setAttribute('data-info-active', 'false');
		}
	}

	@autobind
	handlePickerUpdate(spawning) {
		if (!spawning) {
			this.setState({ pickerActive: false });
		}
	}

	handleSort(e) {
		const data = arrayMove(this.state.data, e.oldIndex, e.newIndex);
		this.setState({
			active: false,
			keyPrefix: randomString(10),
			data,
		});
		const payload = {
			depth: this.props.depth,
			index: this.props.parentIndex,
			indexMap: this.props.indexMap,
			childIndex: this.state.activeIndex,
			name: 'panels',
			rowIndex: e.newIndex,
			value: data,
		};
		this.props.updateChildPanelData(payload);
		trigger({
			event: EVENTS.CHILD_PANEL_MOVED,
			native: false,
			data: payload,
		});
		trigger({ event: EVENTS.PANEL_UPDATED, native: false, data: payload });
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
		this.setState({
			active: false,
			activeIndex: 0,
			data,
		});
		const payload = {
			depth: this.props.depth,
			index: this.props.parentIndex,
			indexMap: this.props.indexMap,
			childIndex: this.state.activeIndex,
			name: 'panels',
			rowIndex: this.state.activeIndex,
			value: data,
		};
		this.props.updateChildPanelData(payload);
		trigger({
			event: EVENTS.CHILD_PANEL_DELETED,
			native: false,
			data: payload,
		});
		trigger({ event: EVENTS.PANEL_UPDATED, native: false, data: payload });
	}

	scrollToActive() {
		if (!this.props.liveEdit && this.state.active) {
			zenscroll.to(this.el.querySelectorAll('[data-row-active="true"]')[0]);
		}
	}

	@autobind
	handleLaunchPicker() {
		if (this.state.types.length === 1) {
			this.handleAddRow({ type: this.state.types[0].type });
		} else {
			this.setState({ pickerActive: !this.state.pickerActive });
		}
	}

	/**
	 * Pushes an empty object onto state which triggers a re render with a new panel row in place :)
	 */

	@autobind
	handleAddRow(panel) {
		const newState = this.state;
		const blueprint = _.find(this.props.childData.types, { type: panel.type });
		newState.data.push({
			type: panel.type,
			depth: this.state.childDepth,
			data: defaultData.panel(blueprint),
		});
		newState.active = true;
		newState.activeIndex = newState.data.length - 1;
		if (this.props.liveEdit) {
			this.props.hidePanel(true);
		}
		this.setState(newState, () => {
			const data = {
				depth: this.props.depth,
				index: this.props.parentIndex,
				indexMap: this.props.indexMap.slice(),
				childIndex: this.state.activeIndex,
				name: 'panels',
				rowIndex: newState.activeIndex,
				value: newState.data,
			};
			this.props.updateChildPanelData(data);
			this.scrollToActive();
			panelConditionals.initConditionalFields(this.el.querySelectorAll(`.${styles.childPanels}`)[0]);
			trigger({
				event: EVENTS.CHILD_PANEL_ADDED,
				native: false,
				data,
			});
			trigger({ event: EVENTS.PANEL_UPDATED, native: false, data });
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
		}
		if (this.state.active && activeIndex === this.state.activeIndex) {
			newState.active = false;
		} else {
			newState.active = true;
		}
		this.setState(newState, () => {
			const event = newState.active ? EVENTS.CHILD_PANEL_ACTIVATED : EVENTS.CHILD_PANEL_DEACTIVATED;
			const data = {
				rowIndex: activeIndex,
				depth: this.props.depth,
				index: this.props.parentIndex,
				indexMap: this.props.indexMap,
				childIndex: this.state.activeIndex,
				name: 'panels',
				value: this.state.data,
			};
			this.scrollToActive();
			this.setChildActiveClass();
			panelConditionals.initConditionalFields(this.el.querySelectorAll(`.${styles.childPanels}`)[0]);
			trigger({
				event,
				native: false,
				data,
			});
		});
	}

	@autobind
	handleNestedGroups(hidden) {
		this.el.setAttribute('data-show-nested', hidden);
	}

	/**
	 * Handles sending us back to the panel from viewing an added row. Communicates with panel parent.
	 */

	@autobind
	handleBackClick() {
		const data = {
			rowIndex: this.state.activeIndex,
			depth: this.props.depth,
			index: this.props.parentIndex,
			indexMap: this.props.indexMap,
			childIndex: this.state.activeIndex,
			name: 'panels',
			value: this.state.data,
		};
		this.props.hidePanel(false);
		this.setState({
			active: false,
			activeIndex: 0,
		});
		trigger({
			event: EVENTS.CHILD_PANEL_DEACTIVATED,
			native: false,
			data,
		});
	}

	/**
	 * Handles receiving data from child panel updates and updating redux store
	 *
	 * @param data passed up from the panel
	 */

	@autobind
	handleDataUpdate(data) {
		const newData = this.state.data;
		if (data.parentMap && data.parentMap.length) {
			_.set(newData[this.state.activeIndex].data, `${data.parentMap.join('.')}.${data.name}`, data.value);
		} else {
			newData[this.state.activeIndex].data[data.name] = data.value;
		}
		const payload = {
			depth: data.depth,
			index: this.props.parentIndex,
			childIndex: this.state.activeIndex,
			childName: data.name,
			childValue: data.value,
			indexMap: this.props.indexMap,
			parentMap: data.parentMap ? data.parentMap : [],
			name: 'panels',
			rowIndex: this.state.activeIndex,
			value: newData,
		};
		this.props.updateChildPanelData(payload);
		trigger({
			event: EVENTS.CHILD_PANEL_UPDATED,
			native: false,
			data: payload,
		});
		trigger({ event: EVENTS.PANEL_UPDATED, native: false, data: payload });
	}

	render() {
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
			'children-field': true,
		});

		const legendClasses = classNames({
			[styles.label]: true,
			'panel-field-legend': true,
		});

		return (
			<div
				ref={r => this.childPanels = r}
				className={fieldClasses}
				data-refresh={this.state.refreshKey}
				data-info-active="false"
				data-show-nested="false"
				data-settings="false"
				data-child-picker-active={this.state.pickerActive}
			>
				<label className={legendClasses}>
					{this.childData.label.plural}
					{this.props.description.length ? <LabelTooltip content={this.props.description} /> : null}
				</label>
				{this.getHeaders()}
				{this.state.active && this.props.liveEdit ? this.getActiveRow() : null}
				{this.state.pickerActive ? this.getPicker() : null}
				{this.getAddRow()}
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({ updateChildPanelData: data => dispatch(updatePanelData(data)) });
const mapStateToProps = state => ({ panels: state.panelData.panels });

Children.propTypes = {
	childData: PropTypes.object,
	data: PropTypes.array,
	depth: PropTypes.number,
	description: PropTypes.string,
	fields: PropTypes.array,
	handleExpanderClick: PropTypes.func,
	hidePanel: PropTypes.func,
	indexMap: PropTypes.array,
	liveEdit: PropTypes.bool,
	name: PropTypes.string,
	panels: PropTypes.array,
	panelLabel: PropTypes.string,
	parentIndex: PropTypes.number,
	updateChildPanelData: PropTypes.func.isRequired,
	updatePanelData: PropTypes.func,
};

Children.defaultProps = {
	childData: {},
	data: [],
	depth: 0,
	description: '',
	fields: [],
	handleExpanderClick: () => {},
	hidePanel: () => {},
	indexMap: [],
	panels: [],
	liveEdit: false,
	name: '',
	panelLabel: '',
	parentIndex: 0,
	updateChildPanelData: () => {},
	updatePanelData: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(Children);
