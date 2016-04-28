import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import PanelCollection from './components/collection';

const rootEl = document.getElementById('modular-content');

ReactDOM.render(
	<AppContainer component={PanelCollection}/>,
	rootEl
);

if (module.hot) {
	module.hot.accept('./components/collection', () => {
		ReactDOM.render(
			<AppContainer component={require('./components/collection').default}/>,
			rootEl
		);
	});
}
