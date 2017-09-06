import * as DATA_KEYS from '../../constants/data-keys';

/**
 * Digs through the supplied panels data based on an indexMap array and either updates whole panel
 * data or a particular field
 *
 * @param indexMap
 * @param panels
 * @param name
 * @param data
 * @returns {Array}
 */

export const traverse = (indexMap = [], panels = [], name = '', data = '') => {
	console.log('traversing');
	const thisIndex = indexMap.shift();

	if (indexMap.length === 0) {
		if (name === DATA_KEYS.PANELS) {
			panels[thisIndex][DATA_KEYS.PANELS] = data;
		} else {
			panels[thisIndex][DATA_KEYS.DATA][name] = data;
		}
		console.log(panels);
		return panels;
	}

	panels[thisIndex][DATA_KEYS.PANELS] = traverse(indexMap, panels[thisIndex][DATA_KEYS.PANELS], name, data);
	console.log(panels);
	return panels;
};
