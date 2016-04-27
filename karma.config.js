var argv = require('yargs').argv;
var path = require('path');

module.exports = function(config) {
	config.set({
		// only use PhantomJS for our 'test' browser
		browsers: ['PhantomJS'],

		// just run once by default unless --watch flag is passed
		singleRun: !argv.watch,

		// which karma frameworks do we want integrated
		frameworks: ['mocha', 'chai'],

		// displays tests in a nice readable format
		reporters: ['spec'],

		// include some polyfills for babel and phantomjs
		files: [
			'node_modules/babel-polyfill/dist/polyfill.js',
			'./node_modules/phantomjs-polyfill/bind-polyfill.js',
			'./ui/tests/**/*.js'
		],
		preprocessors: {
			// these files we want to be precompiled with webpack
			// also run tests throug sourcemap for easier debugging
			['./ui/tests/**/*.js']: ['webpack', 'sourcemap']
		},
		// A lot of people will reuse the same webpack config that they use
		// in development for karma but remove any production plugins like UglifyJS etc.
		// I chose to just re-write the config so readers can see what it needs to have
		webpack: {
			devtool: 'inline-source-map',
			resolve: {
				// allow us to import components in tests like:
				// import Example from 'components/Example';
				root: path.resolve(__dirname, '../ui/src'),

				// allow us to avoid including extension name
				extensions: ['', '.js', '.jsx'],

				// required for enzyme to work properly
				alias: {
					'sinon': 'sinon/pkg/sinon'
				}
			},
			module: {
				// don't run babel-loader through the sinon module
				noParse: [
					/node_modules\/sinon\//
				],
				// run babel loader for our tests
				loaders: [
					{ test: /\.js?$/, exclude: /node_modules/, loader: 'babel' },
				],
			},
			// required for enzyme to work properly
			externals: {
				'jsdom': 'window',
				'cheerio': 'window',
				'react/lib/ExecutionEnvironment': true,
				'react/lib/ReactContext': 'window',
				'react/addons':'window'
			},
		},
		webpackMiddleware: {
			noInfo: true
		},
		// tell karma all the plugins we're going to be using to prevent warnings
		plugins: [
			'karma-mocha',
			'karma-chai',
			'karma-webpack',
			'karma-phantomjs-launcher',
			'karma-spec-reporter',
			'karma-sourcemap-loader'
		]
	});
};