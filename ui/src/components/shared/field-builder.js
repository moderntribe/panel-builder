import React, { PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import componentMap from './field-map';
import Children from '../fields/children';

import getTypeCheckedData from '../../util/data/get-typechecked-data';

import styles from './field-builder.pcss';

/**
 * Assembles a group of fields by passed blueprint data fields object and returns them.
 *
 * @constructor
 */

const FieldBuilder = (props) => {
	const Fields = props.fields.map((field) => {
		const Field = componentMap[field.type.replace(/\\/g, '')];
		if (!Field) {
			return null;
		}

		const classes = classNames({
			[styles.field]: true,
			'panel-input': true,
			[`input-name-${field.name.toLowerCase()}`]: true,
			[`input-type-${field.type.toLowerCase()}`]: true,
		});

		return (
			<div
				className={classes}
				key={_.uniqueId('field-id-')}
				data-settings={props.settings_fields.indexOf(field.name) !== -1}
			>
				<Field
					{...field}
					depth={props.depth}
					panelIndex={props.index}
					parentIndex={props.parentIndex}
					indexMap={props.indexMap}
					parent={props.parent}
					panelLabel={props.label}
					panelType={props.type}
					liveEdit={props.liveEdit}
					data={getTypeCheckedData(field.type, props.data[field.name])}
					updatePanelData={props.updatePanelData}
					handleExpanderClick={props.handleExpanderClick}
					nestedGroupActive={props.nestedGroupActive}
					hidePanel={props.hidePanel}
				/>
			</div>
		);
	});

	const ChildPanels = props.hasChildren ? (
		<Children
			childData={props.children}
			panels={props.panels}
			depth={props.depth}
			parentIndex={props.index}
			indexMap={props.indexMap}
			liveEdit={props.liveEdit}
			data={props.panels}
			updatePanelData={props.updatePanelData}
			handleExpanderClick={props.handleExpanderClick}
			nestedGroupActive={props.nestedGroupActive}
			hidePanel={props.hidePanel}
		/>
	) : null;

	return (
		<div>
			{Fields}
			{ChildPanels}
		</div>
	);
};

FieldBuilder.propTypes = {
	name: PropTypes.string,
	children: PropTypes.object,
	depth: PropTypes.number,
	index: PropTypes.number,
	indexMap: PropTypes.array,
	label: PropTypes.string,
	parent: PropTypes.string,
	fields: PropTypes.array,
	panels: PropTypes.array,
	parentIndex: PropTypes.number,
	liveEdit: PropTypes.bool,
	hasChildren: PropTypes.bool,
	data: PropTypes.object,
	updatePanelData: PropTypes.func,
	settings_fields: React.PropTypes.array,
	hidePanel: PropTypes.func,
	nestedGroupActive: PropTypes.func,
	handleExpanderClick: PropTypes.func,
	type: PropTypes.string,
};

FieldBuilder.defaultProps = {
	name: '',
	children: {},
	childPanels: [],
	depth: 0,
	index: 0,
	indexMap: [],
	label: '',
	fields: [],
	panels: [],
	parent: '',
	parentIndex: 0,
	liveEdit: false,
	hasChildren: false,
	data: {},
	settings_fields: [],
	updatePanelData: () => {},
	hidePanel: () => {},
	nestedGroupActive: () => {},
	handleExpanderClick: () => {},
	type: '',
};

export default FieldBuilder;
