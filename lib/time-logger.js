'use strict';

module.exports = (label, isDebug) => {
	if (isDebug) console.time(label);
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