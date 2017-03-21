import _ from 'lodash';

/**
 * Return default field data for an array of fields. used by group and repeater
 *
 * @param fields
 * @returns {{}}
 */

const getGroupDefaults = (fields = []) => {
	if (!_.isArray(fields)) {
		return {};
	}
	const groupData = {};
	_.forEach(fields, groupField => groupData[groupField.name] = groupField.default);
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
		if (field.type === 'Group') {
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
 */

export const repeater = (fields = []) => getGroupDefaults(fields);
