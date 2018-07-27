import _ from 'lodash';
import { ADMIN_CACHE } from '../../globals/config';

ADMIN_CACHE.files = ADMIN_CACHE.files || {};
ADMIN_CACHE.posts = ADMIN_CACHE.posts || {};

export const addFile = (attachment = 0) => {
	ADMIN_CACHE.files[attachment.id.toString()] = attachment;
};

export const addPost = (post = 0) => {
	ADMIN_CACHE.posts[post.ID.toString()] = post;
};

export const addPosts = (postsObj = {}) => {
	ADMIN_CACHE.posts = _.extend(ADMIN_CACHE.posts, postsObj);
};

export const getFileById = (id = 0) => ADMIN_CACHE.files[id.toString()];
export const getPostById = (id = 0) => ADMIN_CACHE.posts[id.toString()];

/**
 * The system now only uses thumbnails in all ui cases. Currently that is image field, gallery field, post list and quacker.
 * It tries to get a thumb from cache, then tries to get full if not founds. Returns empty string if nothing there.
 *
 * @param id
 * @param property
 * @returns {string}
 */

export const getFilePropertyById = (id = 0, property = 'url') => {
	let prop = '';
	if (id) {
		const cache = getFileById(id);
		prop = cache ? cache[property] : '';
	}

	return prop;
};

/**
 * Gets/caches attachment data.
 *
 * @param attachment {Object} The attachment object
 * @param types {Array} The mime types array
 * @returns {Object}
 */

export const cacheDataByAttachment = (attachment = {}, types = []) => {
	if (_.isEmpty(attachment)) {
		return {};
	}
	const { id, sizes, url, mime, name, subtype, type } = attachment;

	// make sure this mime type is allowed
	if (types.length && !types.filter(m => mime === m).length) {
		console.error(`
				This attachment type is not allowed for this field instance. 
				You can filter "panels_default_allowed_mime_types" if you wish to allow a new type globally, or by field instance.
				Use a mime type string.
			`);
		return {};
	}

	const hasThumbnail = sizes && sizes.thumbnail;
	const link = hasThumbnail ? sizes.thumbnail.url : url;
	const data = {
		id,
		name,
		mime,
		subtype,
		type,
		url: link,
	};

	addFile(data);
	return data;
};
