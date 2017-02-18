import _ from 'lodash';

export const flatten = (data = []) => {

};

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
			if (_.isArray(newData[childIndex].panels)) {
				newData[childIndex].panels.push(panel);
			} else {
				newData[childIndex].panels = [];
				newData[childIndex].panels.push(panel);
			}
		}
	});

	return newData;
};
