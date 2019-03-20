import * as types from './types';

export const addPanel = ( payload ) => ( {
	type: types.ADD_PANEL,
	payload,
} );

export const removePanel = ( payload ) => ( {
	type: types.REMOVE_PANEL,
	payload,
} );

export const updatePanel = ( payload ) => ( {
	type: types.UPDATE_PANEL,
	payload,
} );

