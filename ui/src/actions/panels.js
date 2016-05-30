export const MOVE_PANEL = 'MOVE_PANEL';
export const UPDATE_PANEL_DATA = 'UPDATE_PANEL_DATA';

function movePanelInData(data) {
	return {
		type: MOVE_PANEL,
		data,
	};
}

export function movePanel(data) {
	return dispatch => dispatch(movePanelInData(data));
}

function updatePanel(data) {
	return {
		type: UPDATE_PANEL_DATA,
		data,
	};
}

export function updatePanelData(data) {
	return dispatch => dispatch(updatePanel(data));
}

