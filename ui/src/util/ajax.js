import request from 'superagent';
import { TEMPLATE_SAVER, ICONS_AJAX_ACTION, AUTOSAVE_AJAX_ENDPOINT } from '../globals/config';
import { wpAjax, wpAutosave } from '../globals/wp';

const postEl = document.getElementById('post_ID');
const nonceEl = document.getElementById('_wpnonce');

const post_id = postEl ? parseInt(postEl.value, 10) : 0; //eslint-disable-line
const _wpnonce = nonceEl ? nonceEl.value : ''; //eslint-disable-line

export const savePanelSet = (panels = '', title = '') => {
	const data = {
		action: TEMPLATE_SAVER.params.action,
		nonce: TEMPLATE_SAVER.params.nonce,
		title,
		panels,
	};

	return wpAjax.send({ data });
};

export const saveRevision = (panels = {}) => {
	const data = {
		post_data: {
			post_id,
			_wpnonce,
			...wpAutosave.getPostData('remote'),
			post_content_filtered: panels,
		},
	};

	return request
		.post(`${window.ajaxurl}?action=${AUTOSAVE_AJAX_ENDPOINT}`)
		.set('Content-Type', 'application/json')
		.send(data);
};

export const getPanelHTML = (panels = [], index = 0, indexMap = []) => {
	const data = {
		post_id,
		panels,
		index,
		index_map: indexMap,
	};

	return request
		.post(`${window.ajaxurl}?action=panel_preview`)
		.set('Content-Type', 'application/json')
		.send(data);
};

export const getIconLibrary = (key = '') => {
	const data = {
		action: ICONS_AJAX_ACTION,
		key,
	};

	return wpAjax.send({ data });
};
