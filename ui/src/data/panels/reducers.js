import * as types from './types';
import panel from './panel/reducers';

const INITIAL_STATE = {};

const reducer = ( state = INITIAL_STATE, action ) => {
	switch ( action.type ) {
		case types.ADD_PANEL:
		case types.UPDATE_PANEL:
			return Object.assign(
				{},
				state,
				{ [ action.payload.clientId ]: panel( state[ action.payload.clientId ], action ) },
			);
		case types.REMOVE_PANEL:
			const newKeys = Object.keys( state ).filter( ( panel ) => {
				return panel.clientId !== action.payload.clientId;
			} );
			const newState = newKeys.reduce( ( acc, current ) => {
				acc[ current ] = state[ current ];
				return acc;
			}, {} );
			return newState;
		default:
			return state;
	}
};

export default reducer;
