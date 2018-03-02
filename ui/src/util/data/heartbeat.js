import { MODULAR_CONTENT } from '../../globals/config';
import { wpHeartbeat, wpAutosave } from '../../globals/wp';
import updateQueryVar from './update-query-var';

const title = document.getElementById('title');
let previewUrl = MODULAR_CONTENT.preview_url;
let titleText = title.value;
let settings = {};
let triggeredSave = false;
let currentRevision = 0;
let heartbeat = () => {};
let autosaveCallback = () => {};

const handleAutosaveSuccess = (e, data = {}) => {
	autosaveCallback();
	settings.success();
	const revisionId = parseInt(data.revision_id, 10);
	if (isNaN(revisionId) || currentRevision === revisionId) {
		return;
	}
	currentRevision = revisionId;
	previewUrl = updateQueryVar('revision_id', revisionId, previewUrl);
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
	$(document).on(`after-autosave.${settings.namespace}`, (e, data) => handleAutosaveSuccess(e, data));
};

export const iframePreviewUrl = () => previewUrl;

export const triggerAutosave = (callback = () => {}) => {
	if (!wpAutosave) {
		return;
	}
	autosaveCallback = callback;
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
