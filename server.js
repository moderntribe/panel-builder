var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	hot: true,
	https: true,
	historyApiFallback: true,
	headers: { 'Access-Control-Allow-Origin': '*' },
}).listen(3000, 'localhost', function (err, result) {
	if (err) {
		return console.log(err);
	}

	console.log('Listening at https://localhost:3000/');
});