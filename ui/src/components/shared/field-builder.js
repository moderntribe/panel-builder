import React, { PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import componentMap from './field-map';
import Children from '../fields/children';

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
			<div className={classes} key={_.uniqueId('field-id-')} data-settings={props.settings_fields.indexOf(field.name) !== -1}>
				<Field
					{...field}
					panelIndex={props.index}
					panelLabel={props.label}
					liveEdit={props.liveEdit}
					data={props.data[field.name]}
					updatePanelData={props.updatePanelData}
					handleExpanderClick={props.handleExpanderClick}
					hidePanel={props.hidePanel}
				/>
			</div>
		);
	});

	const ChildPanels = props.hasChildren ? (
		<Children
			childData={props.children}
			panels={props.panels}
			parentIndex={props.index}
			liveEdit={props.liveEdit}
			data={props.data.panels}
			updatePanelData={props.updatePanelData}
			handleExpanderClick={props.handleExpanderClick}
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
	index: PropTypes.number,
	label: PropTypes.string,
	fields: PropTypes.array,
	panels: PropTypes.array,
	liveEdit: PropTypes.bool,
	hasChildren: PropTypes.bool,
	data: PropTypes.object,
	updatePanelData: PropTypes.func,
	settings_fields: React.PropTypes.array,
	hidePanel: PropTypes.func,
	handleExpanderClick: PropTypes.func,
};

FieldBuilder.defaultProps = {
	name: '',
	children: {},
	index: 0,
	label: '',
	fields: [],
	panels: [],
	liveEdit: false,
	hasChildren: false,
	data: {},
	settings_fields: [],
	updatePanelData: () => {},
	hidePanel: () => {},
	handleExpanderClick: () => {},
};

export default FieldBuilder;
