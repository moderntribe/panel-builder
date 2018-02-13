import _ from 'lodash';
import update from 'immutability-helper';
import {
	ADD_PANEL,
	ADD_PANEL_SET,
	INJECT_COLUMNS,
	MOVE_PANEL,
	UPDATE_PANEL_DATA,
	DELETE_PANEL,
} from '../actions/panels';

import { PANELS, BLUEPRINT_TYPES } from '../globals/config';
import arrayMove from '../util/data/array-move';
import * as storeTools from '../util/data/store';
import * as defaultData from '../util/data/default-data';


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
		const panel = {
			...action.data.panels[0],
			panels: [],
		};
		if (action.data.index === -1) {
			newState.panels.push(panel);
		} else {
			newState.panels.splice(action.data.index, 0, panel);
		}

		return newState;

	case INJECT_COLUMNS:
		const rowBlueprint = _.find(BLUEPRINT_TYPES, { type: 'custom_layout_row' });
		const columnBlueprint =_.find(rowBlueprint.children.types, { type: 'layout_column' });
		const columns = JSON.parse(action.data.value).map((column_width) => {
			const column = {
				type: 'layout_column',
				depth: 1,
				data: defaultData.panel(columnBlueprint),
				panels: [],
			};
			column.data.column_width = column_width;
			return column;
		});

		newState.panels[action.data.indexMap[0]].panels = columns;
		return newState;

	case ADD_PANEL_SET:
		_.forEach(action.data, (panel) => {
			newState.panels.push(panel);
		});

		return newState;

	case MOVE_PANEL:
		return update(newState, {
			panels: { $set: arrayMove(newState.panels, action.data.oldIndex, action.data.newIndex) },
		});

	case DELETE_PANEL:
		const panels = _.remove(newState.panels, (panel, i) => {
			return i !== action.data.index;
		});
		return update(newState, {
			panels: { $set: panels }
		});

	case UPDATE_PANEL_DATA:
		const indexMap = action.data.indexMap.slice();
		const parentMap = action.data.parentMap ? action.data.parentMap.slice() : [];
		newState.panels = storeTools.traverse(indexMap, newState.panels, action.data.name, action.data.parent, action.data.value, parentMap);
		return newState;

	default:
		return state;
	}
}

/* eslint-enable */
