import verge from 'verge';

export const setUp = (collection, sidebar) => {
	const bounds = collection.getBoundingClientRect();
	collection.parentNode.style.height = `${collection.offsetHeight}px`;
	collection.style.width = `${collection.offsetWidth}px`;
	sidebar.style.width = `${collection.offsetWidth}px`;
	collection.style.width = `${collection.offsetWidth}px`;
	collection.style.height = `${collection.offsetHeight}px`;
	collection.style.position = 'fixed';
	collection.style.top = `${bounds.top}px`;
	collection.style.left = `${bounds.left}px`;
	sidebar.style.transition = 'all 300ms cubic-bezier(0.445, 0.050, 0.550, 0.950)';
	collection.style.transition = 'all 300ms cubic-bezier(0.445, 0.050, 0.550, 0.950)';
};

export const animate = (collection, sidebar) => {
	collection.style.width = `${verge.viewportW()}px`;
	collection.style.height = `${verge.viewportH()}px`;
	collection.style.top = '0px';
	collection.style.left = '0px';
	sidebar.style.width = '300px';
};

export const reset = (collection, sidebar) => {
	collection.style.width = '';
	sidebar.style.width = '';
	collection.style.height = '';
	collection.style.top = '';
	collection.style.left = '';
	collection.style.position = '';
	collection.style.transition = '';
	sidebar.style.transition = '';
	collection.parentNode.style.height = '';
};
