import _ from 'lodash';
import { ADMIN_CACHE, CONFIG } from '../../globals/config';

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

/**
 * The system now only uses thumbnails in all ui cases. Currently that is image field, gallery field, post list and quacker.
 * It tries to get a thumb from cache, then tries to get full if not founds. Returns empty string if nothing there.
 *
 * @param id
 * @returns {string}
 */

export const getImageSrcById = (id = 0) => {
	let image = '';
	if (id) {
		const cache = getImageById(id);
		if (cache && cache.thumbnail) {
			image = cache.thumbnail;
		} else if (cache && cache.full) {
			image = cache.full;
		}
	}

	return image;
};

/**
 * Gets/caches a thumbnail or full src from an attachment object.
 *
 * @param attachment {Object} The attachment object
 * @param types {Array} The mime types array
 * @returns {string}
 */

export const cacheSrcByAttachment = (attachment = {}, types = []) => {
	if (_.isEmpty(attachment)) {
		return '';
	}

	// make sure this mime type is allowed
	if (types.length && !types.filter(mime => attachment.mime === mime).length) {
		console.error(`
				This attachment type is not allowed for this field instance. 
				You can filter "panels_default_allowed_mime_types" if you wish to allow a new type globally, or by field instance.
				Use a mime type string.
			`);
		return '';
	}

	const hasThumbnail = attachment.sizes && attachment.sizes.thumbnail;
	const image = hasThumbnail ? attachment.sizes.thumbnail.url : attachment.url;
	const size = hasThumbnail ? 'thumbnail' : 'full';

	addImage({
		id: attachment.id,
		[size]: image,
	});

	return image;
};
