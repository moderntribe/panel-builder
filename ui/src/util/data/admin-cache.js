import _ from 'lodash';
import { ADMIN_CACHE } from '../../globals/config';

export function addImage(attachment) {
	if (!ADMIN_CACHE.images) {
		ADMIN_CACHE.images = [];
	}
	const imageInCache = _.find(ADMIN_CACHE.images, { id: attachment.id });
	if (!imageInCache) {
		ADMIN_CACHE.images.push(attachment);
	}
}

export function getImageById(id) {
	return _.find(ADMIN_CACHE.images, { id });
}

export function addPost(post) {
	if (!ADMIN_CACHE.posts) {
		ADMIN_CACHE.posts = [];
	}
	const postInCache = _.find(ADMIN_CACHE.posts, { ID: post.ID });
	if (!postInCache) {
		ADMIN_CACHE.posts.push(post);
	}
}

export function addPosts(postsObj) {
	_.mapKeys(postsObj, (value) => {
		ADMIN_CACHE.posts.push(value);
	});
}

export function getPostById(id) {
	return _.find(ADMIN_CACHE.posts, { ID: id });
}
