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

export const getPanelHTML = (panels = []) => {
	const request = {
		data: {
			post_id,
			panels,
		},
	};

	return wpAjax.send('panel_preview', request);
};
