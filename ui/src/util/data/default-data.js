import _ from 'lodash';

import * as FIELD_TYPES from '../../constants/field-types';

/**
 * Return default field data for an array of fields. used by group and repeater
 *
 * @param fields
 * @param title
 * @returns {{}}
 */

const getGroupDefaults = (fields = [], title = '') => {
	if (!_.isArray(fields)) {
		return {};
	}
	const groupData = {};
	_.forEach(fields, groupField => groupData[groupField.name] = typeof groupField.fields !== 'undefined' ? getGroupDefaults(groupField.fields) : groupField.default);
	if (title) {
		groupData.title = title;
	}
	return groupData;
};

/**
 * Returns default data for a passed field, with special handling for groups
 *
 * @param fields
 * @returns {{}}
 */

const getPanelDefaults = (fields = []) => {
	if (!_.isArray(fields)) {
		return {};
	}
	const panelData = {};
	_.forEach(fields, (field) => {
		if (field.type === FIELD_TYPES.GROUP || field.type === FIELD_TYPES.ACCORDION) {
			panelData[field.name] = getGroupDefaults(field.fields);
		} else {
			panelData[field.name] = field.default;
		}
	});
	return panelData;
};

/**
 * Returns default data for a panel with a passed blueprint
 *
 * @param blueprint
 * @returns {{}}
 */

export const panel = (blueprint = {}) => getPanelDefaults(blueprint.fields);

/**
 * Return default field data for a repeater
 *
 * @param fields
 * @param title
 */

export const repeater = (fields = [], title = '') => getGroupDefaults(fields, title);
