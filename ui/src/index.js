import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configure-store';

import PanelCollection from './components/collection';

const modularContent = document.querySelectorAll('#modular-content > .inside')[0];

const store = configureStore();

ReactDOM.render(
	<Provider store={store}>
		<AppContainer component={PanelCollection} />
	</Provider>,
	modularContent
);

if (module.hot) {
	module.hot.accept('./components/collection', () => {
		ReactDOM.render(
			<Provider store={store}>
				<AppContainer component={require('./components/collection').default}/>
			</Provider>,
			modularContent
		);
	});
}
