import { createSelector } from 'reselect';

export const getAccordionBlock = state => state.panels.accordion;

export const getAccordionImageId = createSelector(
	getAccordionBlock,
	accordion => accordion.imageId,
);

export const getAccordionContent = createSelector(
	getAccordionBlock,
	accordion => accordion.content,
);
