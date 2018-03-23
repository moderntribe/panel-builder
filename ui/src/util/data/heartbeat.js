import { MODULAR_CONTENT } from '../../globals/config';
import { wpHeartbeat } from '../../globals/wp';
import updateQueryVar from './update-query-var';
import * as ajax from '../ajax';

let previewUrl = MODULAR_CONTENT.preview_url;
let settings = {};
let heartbeat = () => {};

/**
 * Dynamically updated on every revision update, used by the iframe to load the preview
 *
 * @returns {string}
 */

export const iframePreviewUrl = () => previewUrl;

/**
 * Triggers save for a new revision, updates revision id on preview url, and calls any callbacks
 * Can be called manually, and also runs on the set rate the init function is passed when the app spins up.
 *
 * @param callback a one time callback you can use when triggering an autosave manually
 */

export const triggerAutosave = (callback = () => {}) => {
	MODULAR_CONTENT.needs_save = false;
	ajax.saveRevision(MODULAR_CONTENT.autosave)
		.then((res) => {
			if (!res.body.success) {
				console.error('Error saving revision for panel data.');
				return;
			}
			previewUrl = updateQueryVar('revision_id', parseInt(res.body.data, 10), previewUrl);

			callback();
			settings.success();

			console.log('Saved panel data as revision and executed any callbacks.');
		})
		.catch(() => console.error('Error saving revision for panel data.'));
};

/**
 * Runs an autosave if needed of panel data
 */

const runHeartbeat = () => {
	heartbeat = setInterval(() => {
		if (!MODULAR_CONTENT.needs_save) {
			return;
		}
		triggerAutosave();
	}, settings.rate);
};

/**
 * Initialize the autosave heartbeat
 *
 * @param opts
 */

export const init = (opts = {}) => {
	settings = Object.assign({}, {
		rate: wpHeartbeat ? wpHeartbeat.interval() * 1000 : 60000,
		success: () => {},
	}, opts);

	runHeartbeat();
};

/**
 * Clean up the heartbeat if you need to
 */

export const destroy = () => clearInterval(heartbeat);
