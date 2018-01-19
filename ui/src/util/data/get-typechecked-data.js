import _ from 'lodash';

import * as FIELD_TYPES from '../../constants/field-types';

/**
 * Makes sure all fields get the correct type of data on init. Used by fieldbuilder.
 *
 * @param type
 * @param fieldData
 * @returns {*}
 */

const getTypeCheckedData = (type = '', fieldData) => {
	let checkedData = fieldData;
	switch (type) {
	case FIELD_TYPES.TEXT:
	case FIELD_TYPES.TITLE:
	case FIELD_TYPES.RADIO:
	case FIELD_TYPES.IMAGE_SELECT:
	case FIELD_TYPES.SWATCH_SELECT:
	case FIELD_TYPES.SELECT:
	case FIELD_TYPES.TEXTAREA:
	case FIELD_TYPES.VIDEO:
		if (!_.isString(fieldData)) {
			checkedData = _.toString(fieldData);
		}
		break;
	case FIELD_TYPES.CHECKBOX:
	case FIELD_TYPES.LINK:
	case FIELD_TYPES.POST_QUACKER:
	case FIELD_TYPES.POST_LIST:
	case FIELD_TYPES.GROUP:
	case FIELD_TYPES.ACCORDION:
		if (!_.isPlainObject(fieldData)) {
			checkedData = _.toPlainObject(fieldData);
		}
		break;
	case FIELD_TYPES.IMAGE:
	case FIELD_TYPES.COLUMN_WIDTH:
	case FIELD_TYPES.NUMBER:
	case FIELD_TYPES.TOGGLE:
		if (!_.isInteger(fieldData)) {
			checkedData = _.toInteger(fieldData);
		}
		break;
	case FIELD_TYPES.IMAGE_GALLERY:
	case FIELD_TYPES.RANGE:
	case FIELD_TYPES.REPEATER:
		if (!_.isArray(fieldData)) {
			checkedData = _.toArray(fieldData);
		}
		break;
	default:
		checkedData = fieldData;
	}
	return checkedData;
};

export default getTypeCheckedData;
