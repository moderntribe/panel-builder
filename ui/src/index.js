import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './panel-collection';

const rootEl = document.getElementById('root');

ReactDOM.render(
	<AppContainer component={App}/>,
	rootEl
);

if (module.hot) {
	module.hot.accept('./panel-collection', () => {
		ReactDOM.render(
			<AppContainer component={require('./panel-collection').default}/>,
			rootEl
		);
	});
}