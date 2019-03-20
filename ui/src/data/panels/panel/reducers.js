import * as types from '../types';
import fields from './fields/reducers';

const INITIAL_STATE = {};

const reducer = ( state = INITIAL_STATE, action ) => {
	switch ( action.type ) {
		case types.ADD_PANEL:
		case types.UPDATE_PANEL:
			return {
				type: action.payload.type,
				fields: fields( state.fields, action ),
			};
		default:
			return state;
	}
};

export default reducer;
