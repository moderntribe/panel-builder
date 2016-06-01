export default function (obj) {
	return Object.keys(obj).map(k => `${k}=${encodeURIComponent(obj[k])}`).join('&');
}
