import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import delegate from 'delegate';
import classNames from 'classnames';

import FieldBuilder from '../shared/field-builder';

import styles from './tab.pcss';
import * as panelConditionals from '../../util/dom/panel-conditionals';

/**
 * Class TabGroup
 *
 * A container for a group of fields laid out in a tabbed ui.
 *
 */

class Tab extends Component {
	constructor(props) {
		super(props);

		this.el = null;
		this.inputDelegates = null;
		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
		panelConditionals.initConditionalFields(this.el);
		this.inputDelegates = delegate(this.el, '.panel-conditional-field input', 'click', e => _.delay(() => {
			this.handleConditionalFields(e);
		}, 100));
	}

	componentDidUpdate() {
		this.el.className.split(' ').forEach((c) => {
			if (c.indexOf('condition-input-name') === -1) {
				return;
			}
			this.el.classList.remove(c);
		});
		panelConditionals.initConditionalFields(this.el);
	}

	componentWillUnmount() {
		this.mounted = false;
		this.inputDelegates.destroy();
	}

	handleConditionalFields(e) {
		const input = e.delegateTarget ? e.delegateTarget : e.target;
		panelConditionals.setConditionalClass(this.el, input);
	}

	render() {
		const fieldClasses = classNames({
			[styles.field]: true,
			'panel-field': true,
			'tab-group-field': true,
			[`tab-name-${this.props.name}`]: true,
		});

		const parentMap = this.props.parentMap.slice();
		parentMap.push(this.props.name);

		return (
			<div ref={r => this.el = r} className={fieldClasses} data-depth={this.props.depth}>
				<FieldBuilder
					fields={this.props.fields}
					data={this.props.data}
					depth={this.props.depth}
					parent={this.props.name}
					parentMap={parentMap}
					index={this.props.panelIndex}
					indexMap={this.props.indexMap}
					updatePanelData={this.props.updatePanelData}
				/>
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
	parentMap: PropTypes.array,
	label: PropTypes.string,
	liveEdit: PropTypes.bool,
	name: PropTypes.string,
	nestedGroupActive: PropTypes.func,
	panelIndex: PropTypes.number,
	panelLabel: PropTypes.string,
	parentIndex: PropTypes.number,
	updatePanelData: PropTypes.func,
	viewport: PropTypes.string,
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
	parentMap: [],
	label: '',
	liveEdit: false,
	name: '',
	nestedGroupActive: () => {},
	panelIndex: 0,
	panelLabel: '',
	parentIndex: 0,
	updatePanelData: () => {},
	viewport: '',
};

export default Tab;
