import {
	MOVE_PANEL,
	UPDATE_PANEL_DATA,
} from '../actions/panels';
import initialData from '../data/panel-data-multi.json';

/* eslint-disable */
export function panelData(state = initialData, action) {
	switch (action.type) {
		case MOVE_PANEL:
			return state;

		case UPDATE_PANEL_DATA:
			return state;

		default:
			return state;
	}
}
/* eslint-enable */
