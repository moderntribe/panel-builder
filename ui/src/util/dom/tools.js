
import { browserTests } from '../tests';

export const closest = (el, selector) => {
	let matchesFn;
	let parent;

	['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some((fn) => {
		if (typeof document.body[fn] === 'function') {
			matchesFn = fn;
			return true;
		}
		return false;
	});

	while (el) {
		parent = el.parentElement;
		if (parent && parent[matchesFn](selector)) {
			return parent;
		}
		el = parent;
	}

	return null;
};

export const insertAfter = (newNode, referenceNode) => {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

export const insertBefore = (newNode, referenceNode) => {
	referenceNode.parentNode.insertBefore(newNode, referenceNode);
};

export const browser = () => {
	let br = 'unknown';
	if (browserTests().chrome) {
		br = 'chrome';
	} else if (browserTests().firefox) {
		br = 'firefox';
	} else if (browserTests().edge) {
		br = 'edge';
	} else if (browserTests().ie) {
		br = 'ie';
	} else if (browserTests().safari) {
		br = 'safari';
	} else if (browserTests().opera) {
		br = 'opera';
	}

	return br;
};

export const os = () => {
	let os = 'unknown';
	if (browserTests().android) {
		os = 'android';
	} else if (browserTests().ios) {
		os = 'ios';
	} else {
		os = browserTests().os;
	}

	return os;
};
