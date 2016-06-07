import {
	MOVE_PANEL,
	UPDATE_PANEL_DATA,
} from '../actions/panels';

// import update from 'react/lib/update';
import initialData from '../data/panel-data-multi.json';

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
	switch (action.type) {
	case MOVE_PANEL:
		return state;

	case UPDATE_PANEL_DATA:
		let newState = state;

		// todo: handle depth
		newState.panels[action.data.index].data[action.data.name] = action.data.value;
		return newState;

	default:
		return state;
	}
}
/* eslint-enable */
