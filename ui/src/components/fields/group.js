import React, { PropTypes } from 'react';
import classNames from 'classnames';

import FieldBuilder from '../shared/field-builder';

import styles from './group.pcss';

const Group = (props) => {
	const updateGroupFieldData = (data) => {
		props.updatePanelData({
			index: data.index,
			name: data.name,
			value: data.value,
			parent: props.name,
		});
	};

	const fieldClasses = classNames({
		[styles.field]: true,
		'panel-field': true,
		'group-field': true,
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
		<fieldset className={fieldClasses}>
			<legend className={legendClasses}>{props.label}</legend>
			<FieldBuilder
				fields={props.fields}
				data={props.data}
				parent={props.name}
				index={props.panelIndex}
				updatePanelData={updateGroupFieldData}
			/>
			<p className={descriptionClasses}>{props.description}</p>
		</fieldset>
	);
};

Group.propTypes = {
	data: PropTypes.object,
	panelIndex: PropTypes.number,
	fields: PropTypes.array,
	label: PropTypes.string,
	description: PropTypes.string,
	name: PropTypes.string,
	default: PropTypes.array,
	updatePanelData: PropTypes.func,
};

Group.defaultProps = {
	data: {},
	panelIndex: 0,
	fields: [],
	label: '',
	description: '',
	name: '',
	default: [],
	updatePanelData: () => {},
};

export default Group;
