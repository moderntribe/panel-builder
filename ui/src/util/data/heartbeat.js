import { MODULAR_CONTENT } from '../../globals/config';
import { wpHeartbeat, wpAutosave } from '../../globals/wp';

const title = document.getElementById('title');
let titleText = title.value;
let settings = {};
let triggeredSave = false;
let heartbeat = () => {};

const handleAutosaveSuccess = () => {
	settings.success();
};

const autosaveDrafts = (e, postdata) => {
	if (triggeredSave && postdata.post_title) {
		postdata.post_title = titleText; // eslint-disable-line
		triggeredSave = false;
	}
	postdata.post_content_filtered = MODULAR_CONTENT.autosave; // eslint-disable-line
};

const bindEvents = () => {
	$(document).on(`before-autosave.${settings.namespace}`, (e, postdata) => autosaveDrafts(e, postdata));
	$(document).on(`after-autosave.${settings.namespace}`, () => handleAutosaveSuccess());
};

export const triggerAutosave = () => {
	if (!wpAutosave) {
		return;
	}
	const timestamp = new Date().getTime();
	MODULAR_CONTENT.needs_save = false;
	titleText = title.value;
	title.value = `${titleText}${timestamp}`;
	triggeredSave = true;
	wpAutosave.server.triggerSave();
	title.value = titleText;
};

const runHeartbeat = () => {
	heartbeat = setInterval(() => {
		if (!MODULAR_CONTENT.needs_save) {
			return;
		}
		triggerAutosave();
	}, settings.rate);
};

export const init = (opts = {}) => {
	settings = Object.assign({}, {
		rate: wpHeartbeat ? wpHeartbeat.interval() * 1000 : 60000,
		namespace: 'panel-autosave',
		success: () => {},
	}, opts);

	bindEvents();
	runHeartbeat();
};

export const destroy = () => {
	clearInterval(heartbeat);
	$(document).off(`before-autosave.${settings.namespace}`, (e, postdata) => this.autosaveDrafts(e, postdata));
	$(document).off(`after-autosave.${settings.namespace}`, () => this.handleAutosaveSuccess());
};
