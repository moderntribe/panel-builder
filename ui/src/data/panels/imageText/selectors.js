import { createSelector } from 'reselect';

export const getImageTextBlock = state => state.panels.imageText;

export const getImageTextImageId = createSelector(
	getImageTextBlock,
	imageText => imageText.imageId,
);

export const getImageTextContent = createSelector(
	getImageTextBlock,
	imageText => imageText.content,
);
