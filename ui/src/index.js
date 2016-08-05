import "babel-polyfill";
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configure-store';

import PanelCollection from './components/collection';

const modularContent = document.getElementById('modular-content-app');
modularContent.classList.add('loaded');

const store = configureStore();

ReactDOM.render(
	<Provider store={store}>
		<AppContainer>
			<PanelCollection />
		</AppContainer>
	</Provider>,
	modularContent
);
/* eslint-disable global-require */
if (module.hot) {
	module.hot.accept('./components/collection', () => {
		const NextApp = require('./components/collection').default;
		ReactDOM.render(
			<Provider store={store}>
				<AppContainer>
					<NextApp />
				</AppContainer>
			</Provider>,
			modularContent
		);
	});
}
/* eslint-enable */
