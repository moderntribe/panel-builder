import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FieldBuilder from '../shared/field-builder';

import styles from './tab.pcss';

/**
 * Class TabGroup
 *
 * A container for a group of fields laid out in a tabbed ui.
 *
 */

const Tab = (props) => {
	const fieldClasses = classNames({
		[styles.field]: true,
		'panel-field': true,
		'tab-group-field': true,
	});

	const parentMap = props.parentMap.slice();
	parentMap.push(props.name);

	return (
		<div className={fieldClasses}>
			<FieldBuilder
				fields={props.fields}
				data={props.data}
				depth={props.depth}
				parent={props.name}
				parentMap={parentMap}
				index={props.panelIndex}
				indexMap={props.indexMap}
				updatePanelData={props.updatePanelData}
			/>
		</div>
	);
};

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
};

export default Tab;
