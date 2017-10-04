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

		return (
			<div ref={r => this.fields = r} className={fieldClasses}>
				<div className={styles.fieldWrap}>
					<p className={descriptionClasses}>{this.props.description}</p>
					<FieldBuilder
						fields={this.props.fields}
						data={this.props.data}
						parent={this.props.name}
						index={this.props.panelIndex}
						indexMap={this.props.indexMap}
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
			value: data.value,
			parent: this.props.name,
		});
	}

	maybeAnimateFields() {
		if (!this.state.active) {
			this.fields.classList.remove(styles.animated);
			tw.to(this.fields, 0.6, { ease: p3.easeOut, height: 0 });
			return;
		}
		tw.set(this.fields, { height: 'auto' });
		tw.from(this.fields, 0.6, { ease: p3.easeOut, height: 0 });
		_.delay(() => this.fields.classList.add(styles.animated), 600);
	}

	/**
	 * Handles the header click and toggles fields into/out of view.
	 */

	@autobind
	handleHeaderClick() {
		this.setState({
			active: !this.state.active,
		}, () => this.maybeAnimateFields());
	}

	render() {
		const fieldClasses = classNames({
			[styles.field]: true,
			[styles.active]: this.state.active,
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
	depth: PropTypes.number,
	parentIndex: PropTypes.number,
	data: PropTypes.object,
	panelIndex: PropTypes.number,
	indexMap: PropTypes.array,
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

Accordion.defaultProps = {
	depth: 0,
	parentIndex: 0,
	indexMap: [],
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

export default Accordion;
