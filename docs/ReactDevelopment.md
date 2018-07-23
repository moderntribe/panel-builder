## React Development Setup

### Node and Dependencies

This system uses node version 6.9.4. If you don't already have that plus some system to control node versions (eg NVM) it
is recommended you install one. For your convenience this project has an .nvmrc file at its root. Once you have installed Node 6.9.4
you can either set it as your default OR every time you come to this project just type `nvm use` to load the correct version.

Next you will need yarn installed globally with `npm install yarn -g`.

After getting your node version ready, installing yarn and making sure you are on 6.9.4, first delete an existing node_modules folder if 
you still have one in place. Then `yarn install`. 

After yarn install has completed you can run the npm scripts that define the tasks for this project. They are currently:

```json
 	"start": "yarn install && npm run dev",
    "bundle": "cross-env NODE_ENV=production webpack -p --progress",
    "dev": "cross-env NODE_ENV=development node server.js",
    "lint": "eslint ./ui/src || exit 0",
    "dist": "yarn install && yarn test && yarn lint && yarn bundle",
    "test": "jest -i",
    "test:watch": "npm test -- --watch"
```
The development task that fires up webpack-dev-server and gets you ready to dev is start. You launch that by typing: `yarn start`

The react scripts will be served at `http://localhost:3000/ui/dist/master.js`. 
To set up your environment to load this file and experience the joys of [hot module replacement](https://webpack.github.io/docs/hot-module-replacement.html) make sure `SCRIPT_DEBUG` is true and you have filtered `modular_content_js_dev_path` with the above src. It is recommended you create a gitignored file in your mu-plugins folder called `mu-local.php`. Then apply the filter like so:

```php
add_filter( 'modular_content_js_dev_path', function() {
	return 'http://localhost:3000/ui/dist/master.js';
});
```

The other tasks must be run in this fashion: `yarn task` . Give the Jest tests a run with `yarn test` to make sure 
things are working well.

This system is also redux dev tools enabled. You will want to [install them](https://github.com/zalmoxisus/redux-devtools-extension)
in chrome if you want to use them.