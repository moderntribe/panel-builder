/**
 * @module
 * @description Shared media helper functions.
 */

import * as AdminCache from '../util/data/admin-cache';
import { wpMedia } from '../globals/wp';

/**
 * @function getThumbnailPath
 * @description Retrieves a thumbnail url from an ID. Request async callback. Uses thumbnail from cache if available or it retrieves from wpMedia
 */
export const getThumbnailPath = (thumbnailID, callback) => {
	if (!thumbnailID || !callback) {
		return false;
	}
	const image = AdminCache.getFileById(thumbnailID);
	if (image) {
		if (image.thumbnail) {
			callback(image.thumbnail);
		} else if (image.full) {
			callback(image.full);
		}
	} else {
		const attachment = wpMedia.attachment(thumbnailID);
		attachment.fetch(
			{
				success: (att) => {
					if (att.attributes && att.attributes.type === 'image') {
						const imageData = AdminCache.cacheDataByAttachment(att.attributes);
						const imageUrl = imageData.url ? imageData.url : '';
						if (imageUrl) {
							callback(imageUrl);
						}
					}
				},
			},
		);
	}
	return true;
};
