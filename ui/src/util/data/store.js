import _ from 'lodash';

import * as DATA_KEYS from '../../constants/data-keys';

/**
 * Digs through the supplied panels data based on an indexMap array and either updates whole panel
 * data or a particular field
 *
 * @param indexMap
 * @param parentMap
 * @param panels
 * @param name
 * @param data
 * @returns {Array}
 */

export const traverse = (indexMap = [], parentMap = [], panels = [], name = '', data = '') => {
	const thisIndex = indexMap.shift();

	if (indexMap.length === 0) {
		if (name === DATA_KEYS.PANELS) {
			panels[thisIndex][DATA_KEYS.PANELS] = data;
		} else if (parentMap.length) {
			_.set(panels[thisIndex].data, `${parentMap.join('.')}.${name}`, data);
		} else {
			panels[thisIndex][DATA_KEYS.DATA][name] = data;
		}
		return panels;
	}

	panels[thisIndex][DATA_KEYS.PANELS] = traverse(indexMap, parentMap, panels[thisIndex][DATA_KEYS.PANELS], name, data);
	return panels;
};
