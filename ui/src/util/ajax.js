import { TEMPLATE_SAVER } from '../globals/config';
import { wpAjax } from '../globals/wp';

const getTitle = () => {
	const title = document.getElementById('title');
	return title ? title.value : '';
};

export const savePanelSet = (panels = {}) => {
	const data = {
		action: TEMPLATE_SAVER.params.action,
		nonce: TEMPLATE_SAVER.params.nonce,
		title: getTitle(),
		panels,
	};

	return wpAjax.send({ data });
};
