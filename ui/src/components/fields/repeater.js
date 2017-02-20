import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import Polyglot from 'node-polyglot';
import Sortable from 'react-sortablejs';
import zenscroll from 'zenscroll';
import _ from 'lodash';

import Button from '../shared/button';
import FieldBuilder from '../shared/field-builder';
import AccordionBack from '../shared/accordion-back';

import arrayMove from '../../util/data/array-move';
import randomString from '../../util/data/random-string';

import styles from './repeater.pcss';

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

	componentDidMount() {
		this.el = ReactDOM.findDOMNode(this.refs.repeater);
	}

	getNewRowData() {
		const newRow = {};
		_.forEach(this.props.fields, (field) => {
			newRow[field.name] = '';
		});

		return newRow;
	}

	/**
	 * On init of the field, state uses this to add empty objects to the existing data array if needed to make sure
	 * we print the min amount of required fields.
	 *
	 * // todo: single child panel leve support for now. when moving into multiple levels refactor to index map
	 *
	 * @returns {*}
	 */

	getPaddedFieldData() {
		const target = this.props.depth === 1 ? this.props.panels[this.props.parentIndex].panels[this.props.panelIndex] : this.props.panels[this.props.panelIndex];
		const store = target.data[this.props.name];
		const fieldData = !_.isEmpty(store) ? store : [];
		let shouldUpdate = false;
		if (fieldData.length < this.props.min) {
			const remaining = this.props.min - fieldData.length;
			_.times(remaining, () =>
				fieldData.push(this.getNewRowData()),
			);
			shouldUpdate = true;
		}

		if (shouldUpdate) {
			this.props.updatePanelData({
				index: this.props.panelIndex,
				name: this.props.name,
				value: fieldData,
			});
		}

		return fieldData;
	}

	/**
	 * Uses Fieldbuilder and Button to generate an accordion hidden field group which is animated into place.
	 *
	 * @returns {XML}
	 */

	@autobind
	getActiveRow() {
		const rowData = this.state.data[this.state.activeIndex] ? this.state.data[this.state.activeIndex] : {};
		const title = rowData.title && rowData.title.length ? rowData.title : `Row ${this.state.activeIndex + 1}`;
		const deleteLabel = this.props.strings['button.delete'];
		const fieldClasses = classNames({
			[styles.fields]: true,
			'panel-row-fields': true,
		});

		return (
			<div className={fieldClasses}>
				<AccordionBack
					title={title}
					panelLabel={this.props.panelLabel}
					handleClick={this.handleBackClick}
					handleExpanderClick={this.props.handleExpanderClick}
				/>
				<FieldBuilder
					fields={this.props.fields}
					data={rowData}
					parent={this.props.name}
					index={this.props.panelIndex}
					updatePanelData={this.updateRepeaterFieldData}
				/>
				<Button
					icon="dashicons-trash"
					text={deleteLabel}
					bare
					full={false}
					classes={styles.deleteRow}
					handleClick={this.handleDeleteRow}
				/>
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
		const polyglot = new Polyglot();
		polyglot.extend({
			row_index: this.props.strings['label.row_index'],
		});
		const rowIndexLabel = polyglot.t('row_index', { index: index + 1, smart_count: index + 1 });
		const title = data.title && data.title.length ? data.title : rowIndexLabel;
		const headerClasses = classNames({
			[styles.header]: true,
			'panel-row-header': true,
			'repeater-header': true,
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
				data-rowIndex={index}
				className={headerClasses}
				onClick={this.handleHeaderClick}
			>
				<h3>{title}</h3>
				<i className={arrowClasses} />
			</div> : <div data-row-active={this.state.active && index === this.state.activeIndex} key={`${this.state.keyPrefix}-${index}`}>
				<div
					data-rowIndex={index}
					className={headerClasses}
					onClick={this.handleHeaderClick}
				>
					<h3>{title}</h3>
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

		return (
			<Sortable
				options={sortOptions}
			>
				{Headers}
			</Sortable>
		);
	}

	/**
	 * Gets the add row button or a message if max is hit.
	 *
	 * @returns {*}
	 */

	@autobind
	getAddRow() {
		let AddRow = null;
		if (this.state.data.length < this.props.max) {
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

	handleSort(e) {
		const data = arrayMove(this.state.data, e.oldIndex, e.newIndex);
		this.setState({
			active: false,
			keyPrefix: randomString(10),
			data,
		});
		this.props.updatePanelData({
			index: this.props.panelIndex,
			name: this.props.name,
			value: data,
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
		this.setState({
			active: false,
			activeIndex: 0,
			data,
		});
		this.props.updatePanelData({
			index: this.props.panelIndex,
			name: this.props.name,
			value: data,
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
		newState.data.push(this.getNewRowData());
		newState.active = true;
		newState.activeIndex = newState.data.length - 1;
		if (this.props.liveEdit) {
			this.props.hidePanel(true);
		}
		this.setState(newState, () => {
			this.props.updatePanelData({
				index: this.props.panelIndex,
				name: this.props.name,
				value: newState.data,
			});
			this.scrollToActive();
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
		const activeIndex = parseInt(e.currentTarget.getAttribute('data-rowIndex'), 10);
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
		this.setState(newState, () => this.scrollToActive());
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
		newData[this.state.activeIndex][data.name] = data.value;
		this.props.updatePanelData({
			index: this.props.panelIndex,
			name: this.props.name,
			value: newData,
		});
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
			<div ref="repeater" className={fieldClasses} data-depth={this.props.depth} data-active={this.state.active}>
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
	depth: PropTypes.number,
	panels: PropTypes.array,
	parentIndex: PropTypes.number,
	panelLabel: PropTypes.string,
	panelIndex: PropTypes.number,
	fields: PropTypes.array,
	strings: PropTypes.object,
	label: PropTypes.string,
	description: PropTypes.string,
	liveEdit: PropTypes.bool,
	name: PropTypes.string,
	default: PropTypes.array,
	updatePanelData: PropTypes.func,
	hidePanel: PropTypes.func,
	nestedGroupActive: PropTypes.func,
	handleExpanderClick: PropTypes.func,
	min: PropTypes.number,
	max: PropTypes.number,
};

Repeater.defaultProps = {
	depth: 0,
	parentIndex: 0,
	panels: [],
	panelIndex: 0,
	panelLabel: '',
	fields: [],
	strings: {},
	label: '',
	description: '',
	liveEdit: false,
	name: '',
	default: [],
	updatePanelData: () => {},
	nestedGroupActive: () => {},
	handleExpanderClick: () => {},
	hidePanel: () => {},
	min: 1,
	max: 12,
};

export default connect(mapStateToProps)(Repeater);
