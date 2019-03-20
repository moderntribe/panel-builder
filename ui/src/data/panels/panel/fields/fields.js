import * as types from './types';

const INITIAL_STATE = {};

const getFieldsFromConfig = ( config ) => {
	config.reduce( ( acc, current ) => {
		acc[ current.name ] = {
			type: current.type,
			label: current.label,
			value: current.default,
		};
		return acc;
	}, {} );
};

const reducer = ( state = INITIAL_STATE, action ) => {
	switch ( action.type ) {
		case types.ADD_PANEL:
		case types.UPDATE_PANEL:
			const keys = Object.keys( state );
			const newState = keys.reduce( ( acc, key ) => {
				acc[ key ] = action.payload.fields[ key ];
				return acc;
			}, {} );
			return newState;
		default:
			return state;
	}
};

export default reducer;
