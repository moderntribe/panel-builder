import React, { PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import componentMap from './field-map';

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
			<div className={classes} key={_.uniqueId('field-id-')}>
				<Field
					{...field}
					panelIndex={props.index}
					panelLabel={props.label}
					data={props.data[field.name]}
					updatePanelData={props.updatePanelData}
					hidePanel={props.hidePanel}
				/>
			</div>
		);
	});

	return (
		<div>
			{Fields}
		</div>
	);
};

FieldBuilder.propTypes = {
	index: PropTypes.number,
	label: PropTypes.string,
	fields: PropTypes.array,
	data: PropTypes.object,
	updatePanelData: PropTypes.func,
	hidePanel: PropTypes.func,
};

FieldBuilder.defaultProps = {
	index: 0,
	label: '',
	fields: [],
	data: {},
	updatePanelData: () => {},
	hidePanel: () => {},
};

export default FieldBuilder;
