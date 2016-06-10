import _ from 'lodash';
import { ADMIN_CACHE } from '../../globals/config';

export function addImage(attachment) {
	if (!ADMIN_CACHE.images) {
		ADMIN_CACHE.images = [];
	}
	ADMIN_CACHE.images.push(attachment);
}

export function getImageById(id) {
	return _.find(ADMIN_CACHE.images, { id: id });
}

export function addPost(post) {
	if (!ADMIN_CACHE.posts) {
		ADMIN_CACHE.posts = [];
	}
	ADMIN_CACHE.posts.push(post);
}

export function getPostById(id) {
	return _.find(ADMIN_CACHE.posts, { ID: id });
}

