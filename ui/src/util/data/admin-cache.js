import _ from 'lodash';
import { ADMIN_CACHE } from '../../globals/config';

export function addImage(attachment) {
	const sizes = {};
	_.forIn(attachment.sizes, (value, key) => {
		sizes[key] = value.url;
	});
	ADMIN_CACHE.images[attachment.id.toString()] = sizes;
}

export function getImageById(id) {
	return ADMIN_CACHE.images[id];
}
