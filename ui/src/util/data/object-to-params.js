export default (obj) => Object.keys(obj).map(k => `${k}=${encodeURIComponent(obj[k])}`).join('&');
