import _ from 'lodash';

/**
 * Flatten child panel data down to single level. Just child support for now, php can handle deeper since we move to there
 *
 * @param data
 */

export const flatten = (data = []) => {
	const newData = [];
	data.forEach((panel) => {
		if (Array.isArray(panel.panels)) {
			const children = _.cloneDeep(panel.panels);
			newData.push(panel);
			delete newData[newData.length - 1].panels;
			children.forEach(child => newData.push(child));
		} else {
			newData.push(panel);
		}
	});
	return newData;
};

/**
 * Nest child panel data, for now just one level support. We dont ever want to go past grandchild and have never even used that, but,
 * we can chat this out later.
 *
 * @param data
 * @returns {Array}
 */

export const nest = (data = []) => {
	const newData = [];
	let childIndex = 0;
	data.forEach((panel) => {
		if (panel.depth === 0) {
			newData.push(panel);
			return;
		}
		if (panel.depth === 1) {
			childIndex = newData.length - 1;
			if (Array.isArray(newData[childIndex].panels)) {
				newData[childIndex].panels.push(panel);
			} else {
				newData[childIndex].panels = [];
				newData[childIndex].panels.push(panel);
			}
		}
	});

	return newData;
};
