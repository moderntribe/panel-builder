var path = require('path');
var webpack = require('webpack');

module.exports = {
	devtool: 'eval',
	entry: [
		'react-hot-loader/patch',
		'webpack-dev-server/client?http://localhost:3000',
		'webpack/hot/only-dev-server',
		'./ui/src/index'
	],
	externals: {
		jquery: 'jQuery',
	},
	resolveLoader: {
		root: path.join(__dirname, 'node_modules'),
	},
	resolve: {
		extensions: ['', '.js', '.jsx', 'json'],
		modulesDirectories: ['node_modules'],
		fallback: path.join(__dirname, 'node_modules'),
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			jQuery: 'jquery',
			$: 'jquery',
			_: 'lodash',
		}),
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel'],
				include: path.join(__dirname, 'ui/src'),
				exclude: /node_modules/,
			},
			{
				include: /\.json$/,
				loaders: ['json-loader'],
			},
		]
	}
};
