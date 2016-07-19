export const MOVE_PANEL = 'MOVE_PANEL';
export const UPDATE_PANEL_DATA = 'UPDATE_PANEL_DATA';
export const ADD_PANEL = 'ADD_PANEL';
export const ADD_PANEL_SET = 'ADD_PANEL_SET';
export const DELETE_PANEL = 'DELETE_PANEL';

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

function addPanel(data) {
	return {
		type: ADD_PANEL,
		data,
	};
}

export function addNewPanel(data) {
	return dispatch => dispatch(addPanel(data));
}

function addPanelSet(data) {
	return {
		type: ADD_PANEL_SET,
		data,
	};
}

export function addNewPanelSet(data) {
	return dispatch => dispatch(addPanelSet(data));
}

function deletePanel(data) {
	return {
		type: DELETE_PANEL,
		data,
	};
}

export function deletePanelAtIndex(data) {
	return dispatch => dispatch(deletePanel(data));
}
