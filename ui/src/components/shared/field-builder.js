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
	const Fields = _.map(props.fields, (field) => {
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
	children: PropTypes.object,
	data: PropTypes.object,
	depth: PropTypes.number,
	fields: PropTypes.array,
	handleExpanderClick: PropTypes.func,
	hasChildren: PropTypes.bool,
	hidePanel: PropTypes.func,
	index: PropTypes.number,
	indexMap: PropTypes.array,
	label: PropTypes.string,
	liveEdit: PropTypes.bool,
	name: PropTypes.string,
	nestedGroupActive: PropTypes.func,
	panels: PropTypes.array,
	parentIndex: PropTypes.number,
	settings_fields: React.PropTypes.array,
	type: PropTypes.string,
	updatePanelData: PropTypes.func,
};

FieldBuilder.defaultProps = {
	childPanels: [],
	children: {},
	data: {},
	depth: 0,
	fields: [],
	handleExpanderClick: () => {},
	hasChildren: false,
	hidePanel: () => {},
	index: 0,
	indexMap: [],
	label: '',
	liveEdit: false,
	name: '',
	nestedGroupActive: () => {},
	panels: [],
	parentIndex: 0,
	settings_fields: [],
	type: '',
	updatePanelData: () => {},
};

export default FieldBuilder;
