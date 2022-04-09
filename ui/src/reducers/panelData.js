import _ from 'lodash';
import update from 'react/lib/update';
import {
	ADD_PANEL,
	ADD_PANEL_SET,
	MOVE_PANEL,
	UPDATE_PANEL_DATA,
	DELETE_PANEL,
	CLONE_PANEL,
} from '../actions/panels';

import { PANELS } from '../globals/config';
import { UI_I18N } from '../globals/i18n';
import arrayMove from '../util/data/array-move';
import * as storeTools from '../util/data/store';


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

	case ADD_PANEL_SET:
		_.forEach(action.data, (panel) => {
			newState.panels.push(panel);
		});

		return newState;

	case CLONE_PANEL:
		const clonedPanel = _.cloneDeep(action.data.panels[0]);

		clonedPanel.panels = [];
		clonedPanel.data.title += ` (${UI_I18N['message.cloned_title']})`;

		newState.panels.push(clonedPanel);

		return update(newState, {
			panels: { $set: newState.panels }
		});

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
		newState.panels = storeTools.traverse(indexMap, newState.panels, action.data.name, action.data.parent, action.data.value);
		return newState;

	default:
		return state;
	}
}

/* eslint-enable */
