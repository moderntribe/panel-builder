import _ from 'lodash';

export const flatten = (data = []) => {

};

export const nest = (data = []) => {
	const newData = [];
	let currentDepth = 0;
	data.forEach((panel, i) => {
		if (currentDepth === panel.depth) {
			newData.push(panel);
			return;
		}
		if (panel.depth === 0) {
			newData.push(panel);
			currentDepth = 0;
			return;
		}
		if (panel.depth === 1) {
			if (_.isArray(newData[i].panels)) {
				newData[i].panels.push(panel);
			} else {
				newData[i].panels = [];
				newData[i].panels.push(panel);
			}
			currentDepth = 1;
		}
	});

	return newData;
};
