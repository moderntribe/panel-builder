import * as DATA_KEYS from '../../constants/data-keys';

/**
 * Digs through the supplied panels data based on an indexMap array and either updates whole panel
 * data or a particular field
 *
 * @param indexMap
 * @param panels
 * @param name
 * @param parent
 * @param data
 * @param parentMap
 * @returns {Array}
 */

export const traverse = (indexMap = [], panels = [], name = '', parent = '', data = '', parentMap = []) => {
	const thisIndex = indexMap.shift();

	console.log(parentMap);
	console.log(thisIndex);

	if (indexMap.length === 0) {
		if (name === DATA_KEYS.PANELS) {
			panels[thisIndex][DATA_KEYS.PANELS] = data;
		} else if (parent.length) {
			const parentData = panels[thisIndex].data[parent];
			panels[thisIndex].data[parent] = parentData || {};
			panels[thisIndex].data[parent][name] = data;
		} else {
			panels[thisIndex][DATA_KEYS.DATA][name] = data;
		}
		return panels;
	}

	panels[thisIndex][DATA_KEYS.PANELS] = traverse(indexMap, panels[thisIndex][DATA_KEYS.PANELS], name, parent, data);
	return panels;
};
