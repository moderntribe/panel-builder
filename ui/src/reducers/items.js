const initialState = {
	items: [{
		text: 'React',
		done: true,
	}, {
		text: 'Redux',
		done: true,
	}, {
		text: 'Redux logger',
		done: true,
	}, {
		text: 'React document meta',
		done: true,
	}, {
		text: 'Karma',
		done: true,
	}, {
		text: 'Mocha',
		done: true,
	}],
};

/* eslint-disable */
export function items(state = initialState, action) {
	switch (action.type) {
		case 'ADD_ITEM':
			return state;

		case 'DELETE_ITEM':
			return state;

		default:
			return state;
	}
}
/* eslint-enable */
