import * as types from '../../types';

const INITIAL_STATE = {};

const reducer = ( state = INITIAL_STATE, action ) => {
	switch ( action.type ) {
		case types.ADD_PANEL: {
			const keys = Object.keys( action.payload.fields );
			const newState = keys.reduce( ( acc, key ) => {
				acc[ key ] = action.payload.fields[ key ];
				return acc;
			}, {} );
			return newState;
		}
		case types.UPDATE_PANEL: {
			const keys = Object.keys( state );
			const newState = keys.reduce( ( acc, key ) => {
				acc[ key ] = action.payload.fields[ key ];
				return acc;
			}, {} );
			return newState;
		}
		default:
			return state;
	}
};

export default reducer;
