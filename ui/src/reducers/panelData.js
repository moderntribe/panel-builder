import _ from 'lodash';
import {
	ADD_PANEL,
	ADD_PANEL_SET,
	MOVE_PANEL,
	UPDATE_PANEL_DATA,
} from '../actions/panels';

import { PANELS } from '../globals/config';
import arrayMove from '../util/data/array-move';

const initialData = {
	panels: PANELS,
};

// when needing deep update can do like yo:
// let newState = update(state, {
// 	panels: {
// 		[action.data.index]: {
// 			data: {
// 				[action.data.name]: { $set: action.data.value },
// 			},
// 		},
// 	},
// });

/* eslint-disable */
export function panelData(state = initialData, action) {
	const newState = state;
	switch (action.type) {
	case ADD_PANEL:
		if (action.data.index === -1) {
			newState.panels.push(action.data.panels[0]);
		} else {
			newState.panels.splice(action.data.index, 0, action.data.panels[0]);
		}

		return newState;

	case ADD_PANEL_SET:
		_.forEach(action.data, (panel) => {
			newState.panels.push(panel);
		});

		return newState;

	case MOVE_PANEL:
		newState.panels = arrayMove(newState.panels, action.data.oldIndex, action.data.newIndex);
		return newState;

	case UPDATE_PANEL_DATA:
		if (action.data.parent) {
			newState.panels[action.data.index].data[action.data.parent][action.data.name] = action.data.value;
		} else {
			newState.panels[action.data.index].data[action.data.name] = action.data.value;
		}

		return newState;

	default:
		return state;
	}
}
/* eslint-enable */
