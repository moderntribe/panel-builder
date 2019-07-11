export default function getAllMatches(source, regex) {
	const matches = [];
	source.replace(regex, function () {
		matches.push({
			match: arguments[0],
			offset: arguments[arguments.length - 2],
			groups: Array.prototype.slice.call(arguments, 1, -2),
		});
		return arguments[0];
	});
	return matches;
}
