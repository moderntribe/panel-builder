import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
			'panel-builder__accordion-fields': true,
		});
		const descriptionClasses = classNames({
			[styles.description]: true,
			'panel-builder__field-description': true,
		});
		const parentMap = this.props.parentMap.slice();
		parentMap.push(this.props.name);

		return (
			<div ref={r => this.fields = r} className={fieldClasses}>
				<div className={styles.fieldWrap}>
					<p className={descriptionClasses}>{this.props.description}</p>
					<FieldBuilder
						fields={this.props.fields}
						data={this.props.data}
						parent={this.props.name}
						parentMap={parentMap}
						parentType={this.props.name}
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
			parentMap: data.parentMap,
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
	parentMap: PropTypes.array,
	label: PropTypes.string,
	liveEdit: PropTypes.bool,
	name: PropTypes.string,
	nestedGroupActive: PropTypes.func,
	panelIndex: PropTypes.number,
	panelLabel: PropTypes.string,
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
	parentMap: [],
	label: '',
	liveEdit: false,
	name: '',
	nestedGroupActive: () => {},
	panelIndex: 0,
	panelLabel: '',
	parent: '',
	parentIndex: 0,
	type: '',
	updatePanelData: () => {},
};

export default Accordion;
