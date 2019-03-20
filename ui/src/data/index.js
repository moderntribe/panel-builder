import { combineReducers } from 'redux';
import panels from './panels';
import sagas from './sagas';
import store from '../store';

const rootReducer = combineReducers({
	panels,
});

export const initData = () => {
	sagas();
};

export const store = initStore();

export default rootReducer;
