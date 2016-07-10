import _ from 'lodash';
import { ADMIN_CACHE } from '../../globals/config';

ADMIN_CACHE.images = ADMIN_CACHE.images || {};
ADMIN_CACHE.posts = ADMIN_CACHE.posts || {};

export const addImage = (attachment = 0) => {
	ADMIN_CACHE.images[attachment.id.toString()] = attachment;
};

export const addPost = (post = 0) => {
	ADMIN_CACHE.posts[post.ID.toString()] = post;
};

export const addPosts = (postsObj = {}) => {
	ADMIN_CACHE.posts = _.extend(ADMIN_CACHE.posts, postsObj);
};

export const getImageById = (id = 0) => ADMIN_CACHE.images[id.toString()];
export const getPostById = (id = 0) => ADMIN_CACHE.posts[id.toString()];
