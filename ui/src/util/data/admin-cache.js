import _ from 'lodash';
import { ADMIN_CACHE } from '../../globals/config';

export function addImage(attachment) {
	if (!ADMIN_CACHE.images) {
		ADMIN_CACHE.images = {};
	}
	ADMIN_CACHE.images[attachment.id.toString()] = attachment;
}

export function getImageById(id) {
	return ADMIN_CACHE.images[id.toString()];
}

export function addPost(post) {
	if (!ADMIN_CACHE.posts) {
		ADMIN_CACHE.posts = {};
	}
	ADMIN_CACHE.posts[post.ID.toString()] = post;
}

export function addPosts(postsObj) {
	if (!ADMIN_CACHE.posts) {
		ADMIN_CACHE.posts = {};
	}
	ADMIN_CACHE.posts = _.extend(ADMIN_CACHE.posts, postsObj);
}

export function getPostById(id) {
	return ADMIN_CACHE.posts[id.toString()];
}
