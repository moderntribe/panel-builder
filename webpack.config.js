var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DEBUG = process.env.NODE_ENV !== 'production';

var devtool = DEBUG ? 'eval' : 'source-map';
var entry = DEBUG ? [
	'react-hot-loader/patch',
	'webpack-dev-server/client?http://localhost:3000',
	'webpack/hot/only-dev-server',
	'./ui/src/index',
] : [
	'react-hot-loader/patch',
	'babel-polyfill',
	'./ui/src/index',
];
var plugins = [
	new webpack.ProvidePlugin({
		jQuery: 'jquery',
		$: 'jquery',
	}),
	new ExtractTextPlugin('ui/dist/master.css', {
		allChunks: true,
	}),
];
var cssloader;
if (DEBUG) {
	plugins.push(new webpack.HotModuleReplacementPlugin());
	cssloader = 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader';
} else {
	plugins.push(new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production')
		},
	}));
	cssloader = ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader');
}

module.exports = {
	devtool: devtool,
	entry: entry,
	externals: {
		jquery: 'jQuery',
	},
	resolveLoader: {
		root: path.join(__dirname, 'node_modules'),
	},
	resolve: {
		extensions: ['', '.js', '.jsx', 'json', '.pcss'],
		modulesDirectories: ['node_modules'],
		fallback: path.join(__dirname, 'node_modules'),
	},
	output: {
		path: path.join(__dirname, '/'),
		filename: 'ui/dist/master.js',
		publicPath: 'http://localhost:3000/'
	},
	plugins: plugins,
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				include: path.join(__dirname, 'ui/src'),
				exclude: /node_modules/,
				query: {
					'plugins': ['lodash'],
				}
			},
			{
				include: /\.json$/,
				loaders: ['json-loader'],
			},
			{
				test: /\.pcss$/,
				loader: cssloader,
			},
		]
	},
	postcss: [
		require('postcss-inline-comment'),
		require('postcss-import'),
		require('postcss-custom-media'),
		require('postcss-quantity-queries'),
		require('postcss-aspect-ratio'),
		require('postcss-cssnext')({ browsers: ['last 3 versions', 'ie 10'] }),
		require('postcss-nested'),
		require('lost'),
	],
};
