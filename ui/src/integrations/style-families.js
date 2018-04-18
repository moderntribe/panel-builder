import _ from 'lodash';

import { CONFIG, STYLE_FAMILIES } from '../globals/config';

const state = {
	updatedFamilies: {},
};

/**
 * @function updateStyleFamily
 * @description Update each style family group on the state object
 */

const updateStyleFamily = (key, data) => {
	state.updatedFamilies[key] = Object.keys(data.value).map(id => ({
		label: id,
		value: `style-family-${key}-${id}`,
	}));
};

/**
 * @function updateStyleFamilies
 * @description Aggregate all style family data from the passed site builder store and update the global object.
 */

const updateStyleFamilies = (e) => {
	state.updatedFamilies = {};
	Object.entries(e.detail).forEach(([key, value]) => {
		if (key.indexOf('style-families') === -1) {
			return;
		}
		updateStyleFamily(key, value);
	});
	CONFIG.style_families = state.updatedFamilies;
	console.log('Injected updated style families on window.ModularContentConfig.');
};

/**
 * @function bindEvents
 * @description Binds the events for this module
 */

const bindEvents = () => {
	document.addEventListener('modern_tribe/site_builder_updated_settings', updateStyleFamilies);
};

/**
 * @function init
 * @description Initializes this module
 */

const init = () => {
	if (_.isEmpty(STYLE_FAMILIES)) {
		return;
	}
	bindEvents();
	console.log('Initialized panel builder style family integration.');
};

export default init;
