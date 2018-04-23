import classNames from 'classnames';

import * as FIELD_TYPES from '../../constants/field-types';
import * as DATA_KEYS from '../../constants/data-keys';

/**
 * Returns the default classes that most fields use on their wrapper and label/desc
 *
 * @param styles
 * @param props
 * @param conditional
 * @returns {{fieldClasses: *, descriptionClasses: *, labelClasses: *}}
 */

export const defaultFieldClasses = (styles, props = {}, conditional = false) => {
	const labelClasses = classNames({
		[styles.label]: true,
		'panel-field-label': true,
	});
	const descriptionClasses = classNames({
		[styles.description]: true,
		'panel-field-description': true,
	});
	const fieldClasses = classNames({
		[styles.field]: true,
		[styles.compact]: props.layout && props.layout === DATA_KEYS.COMPACT_LAYOUT,
		[styles.showArrows]: props.show_arrows,
		'panel-field': true,
		'panel-conditional-field': conditional,
	});

	return {
		fieldClasses,
		descriptionClasses,
		labelClasses,
	};
};

export const isCompactField = (field = {}) => {
	let isCompact;
	switch (field.type) {
	case FIELD_TYPES.NUMERIC_INPUT:
	case FIELD_TYPES.TEXT:
		isCompact = field.layout && field.layout === DATA_KEYS.COMPACT_LAYOUT;
		break;
	default:
		isCompact = false;
	}
	return isCompact;
};

export const optionStyles = (props = {}) => {
	const styles = {};
	if (props[DATA_KEYS.OPTION_WIDTH] && props[DATA_KEYS.OPTION_WIDTH] < 12) {
		styles.width = `${parseFloat((props[DATA_KEYS.OPTION_WIDTH] / 12 * 100).toFixed(10))}%`;
	}

	return styles;
};

export const fieldStyles = (field = {}) => {
	const styles = {};
	if (field[DATA_KEYS.INPUT_WIDTH] && field[DATA_KEYS.INPUT_WIDTH] < 12) {
		styles.width = `calc(${parseFloat((field[DATA_KEYS.INPUT_WIDTH] / 12 * 100).toFixed(10))}% - 5px)`;
		styles.marginRight = '5px';
	}

	return styles;
};
