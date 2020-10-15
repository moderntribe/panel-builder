import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import TweenMax, { Power3 } from 'gsap';

import FieldBuilder from '../shared/field-builder';

import styles from './accordion.pcss';

const tw = window.TweenMax ? window.TweenMax : TweenMax;
const p3 = window.Power3 ? window.Power3 : Power3;

class Accordion extends Component {
	constructor(props) {
		super(props);
		this.active = false;
	}

	/**
	 * Gets the header which toggles the group into view
	 * @returns {XML}
	 */

	getHeader() {
		const headerClasses = classNames({
			[styles.header]: true,
			'panel-builder__row-header': true,
		});
		const arrowClasses = classNames({
			'dashicons': true,
			[styles.arrow]: true,
			'panel-builder__row-arrow': true,
			'dashicons-arrow-right-alt2': true,
		});

		const expanded = this.state.active ? 'true' : 'false';

		const escapedLabel = this.props.label.replace(/"/g, '\\\\\"');
		const buttonLabel = `${this.state.active ? 'Collapse' : 'Expand'} ${escapedLabel}`;

		return (
			<div
				className={headerClasses}
				onClick={this.handleHeaderClick}
			>
				<h3>{this.props.label}</h3>
				<button aria-expanded={expanded} onClick={this.handleArrowClick} className={arrowClasses} aria-label={buttonLabel} />
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
			'panel-builder__accordion-fields': true,
		});
		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-builder__field-description': true,
		});

		return (
			<div ref={r => this.fields = r} className={fieldClasses}>
				<div className={styles.fieldWrap}>
					<p className={descriptionClasses}>{this.props.description}</p>
					<FieldBuilder
						fields={this.props.fields}
						data={this.props.data}
						parent={this.props.name}
						parentType={this.props.name}
						panelType={this.props.panelType}
						index={this.props.panelIndex}
						indexMap={this.props.indexMap}
						type={this.props.type}
						updatePanelData={this.updateGroupFieldData}
					/>
				</div>
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
			depth: this.props.depth,
			index: data.index,
			indexMap: this.props.indexMap,
			name: data.name,
			parent: this.props.name,
			value: data.value,
		});
	}

	maybeAnimateFields() {
		if (!this.active) {
			this.el.classList.remove(styles.active);
			this.fields.classList.remove(styles.animated);
			tw.to(this.fields, 0.6, { ease: p3.easeOut, height: 0 });
			return;
		}
		this.el.classList.add(styles.active);
		tw.set(this.fields, { height: 'auto' });
		tw.from(this.fields, 0.6, { ease: p3.easeOut, height: 0 });
		_.delay(() => this.fields.classList.add(styles.animated), 600);
	}

	/**
	 * Handles the header click and toggles fields into/out of view.
	 */

	@autobind
	handleHeaderClick() {
		this.active = !this.active;
		this.maybeAnimateFields();
	}

	/**
	 * Handles clicking the arrow button to activate the header click.
	 */

	@autobind
	handleArrowClick(e) {
		e.stopPropagation();
		e.preventDefault();
		e.currentTarget.parentElement.click();
		return false;
	}

	render() {
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-builder__field': true,
			'panel-builder__accordion-field': true,
		});

		return (
			<div ref={r => this.el = r} className={fieldClasses}>
				{this.getHeader()}
				{this.getFields()}
			</div>
		);
	}

}

Accordion.propTypes = {
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
	panelType: PropTypes.string,
	parent: PropTypes.string,
	parentIndex: PropTypes.number,
	type: PropTypes.string,
	updatePanelData: PropTypes.func,
};

Accordion.defaultProps = {
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
	panelType: '',
	parent: '',
	parentIndex: 0,
	type: '',
	updatePanelData: () => {},
};

export default Accordion;
