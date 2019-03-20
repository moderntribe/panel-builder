import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../data';

export default function configureStore(initialState) {
	const logger = createLogger({
		collapsed: true,
		predicate: () =>
		process.env.NODE_ENV === 'development', // eslint-disable-line no-unused-vars
	});

	const middleware = [thunkMiddleware, logger];
	const store = createStore(rootReducer, initialState, compose(
		applyMiddleware(...middleware),
		window.devToolsExtension ? window.devToolsExtension() : f => f,
	));

	if (module.hot) {
		module.hot.accept('../data', () => {
			/* eslint-disable global-require */
			const nextRootReducer = require('../data').default;
			/* eslint-enable */
			store.replaceReducer(nextRootReducer);
		});
	}

	return store;
}
