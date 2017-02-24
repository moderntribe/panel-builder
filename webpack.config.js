var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DEBUG = process.env.NODE_ENV !== 'production';

var devtool = DEBUG ? 'eval' : 'source-map';
var entry = DEBUG ? [
	'react-hot-loader/patch',
	'webpack-dev-server/client?http://localhost:3000',
	'webpack/hot/only-dev-server',
	path.resolve(__dirname, 'ui/src/index'),
] : [
	'react-hot-loader/patch',
	'babel-polyfill',
	path.resolve(__dirname, 'ui/src/index'),
];
var plugins = [
	new webpack.ProvidePlugin({
		jQuery: 'jquery',
		$: 'jquery',
	}),
	new ExtractTextPlugin({ filename: 'master.css', disable: false, allChunks: true }),
	new webpack.LoaderOptionsPlugin({
		options: {
			context: __dirname,
			postcss: [
				require('postcss-inline-comment'),
				require('postcss-import'),
				require('postcss-custom-media'),
				require('postcss-quantity-queries'),
				require('postcss-aspect-ratio'),
				require('postcss-cssnext')({ browsers: ['last 3 versions', 'ie 11'] }),
				require('postcss-nested'),
				require('postcss-inline-svg'),
				require('lost'),
			]
		}
	}),
];
var cssloader;
if (DEBUG) {
	plugins.push(new webpack.HotModuleReplacementPlugin());
	cssloader = 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader';
} else {
	plugins.push(new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production'),
		},
	}));
	cssloader = ExtractTextPlugin.extract({
		fallbackLoader: 'style-loader',
		loader: [
			'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
			'postcss-loader'
		]
	});
}

module.exports = {
	devtool: devtool,
	entry: entry,
	externals: {
		jquery: 'jQuery',
	},
	resolveLoader: {
		modules: [
			path.resolve(__dirname, 'node_modules'),
		]
	},
	resolve: {
		extensions: ['.js', '.jsx', 'json', '.pcss'],
		modules: [
			path.resolve('./ui/src'),
			path.resolve(__dirname, 'node_modules'),
		]
	},
	output: {
		path: DEBUG ? path.join(__dirname, '/') : path.join(__dirname, '/ui/dist/'),
		filename: DEBUG ? 'ui/dist/master.js' : 'master.js',
		publicPath: DEBUG ? 'http://localhost:3000/' : '',
	},
	plugins: plugins,
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					'plugins': ['lodash'],
				}
			},
			{
				test: /\.(png|jpg|jpeg)$/,
				loader: 'url-loader?limit=100000&name=./img/[name]__[hash:base64:5].[ext]',
			},
			{
				test: /\.pcss$/,
				loader: cssloader,
			},
		],
	},
};

