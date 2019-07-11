
export default function sortObj(obj, order) {
	let key;
	const tempArry = [];
	let i;
	const tempObj = {};

	for (key in obj) { //eslint-disable-line
		tempArry.push(key);
	}

	tempArry.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

	if (order === 'desc') {
		for (i = tempArry.length - 1; i >= 0; i--) {
			tempObj[tempArry[i]] = obj[tempArry[i]];
		}
	} else {
		for (i = 0; i < tempArry.length; i++) {
			tempObj[tempArry[i]] = obj[tempArry[i]];
		}
	}

	return tempObj;
}
