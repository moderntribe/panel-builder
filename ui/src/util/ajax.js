import request from 'superagent';
import { TEMPLATE_SAVER } from '../globals/config';
import { wpAjax } from '../globals/wp';

const post_id = parseInt(document.getElementById('post_ID').value, 10); // eslint-disable-line

export const savePanelSet = (panels = '', title = '') => {
	const data = {
		action: TEMPLATE_SAVER.params.action,
		nonce: TEMPLATE_SAVER.params.nonce,
		title,
		panels,
	};

	return wpAjax.send({ data });
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
