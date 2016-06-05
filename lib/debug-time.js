module.exports = function(label) {
	if (process.env['NODE_ENV'] === 'dev') console.time(label);
	return {
		start: function(newLable) {
			if (process.env['NODE_ENV'] !== 'dev') return;
			console.timeEnd(label);
			label = newLable;
			console.time(label);
		},
		allEnd: function() {
			if (process.env['NODE_ENV'] !== 'dev') return;
			console.timeEnd(label);
		}
	};
};