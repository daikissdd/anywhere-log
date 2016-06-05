'use strict';

const winston = require('winston');
const Papertrail = require('winston-papertrail').Papertrail;

module.exports = {
	create(transports) {
		return new winston.Logger({transports});
	},
	pt(host, port) {
		const pt = new Papertrail({
			host,
			port,
			colorize: true
		});
		pt.on('error', (err) => { console.log('PTLOGGER:ERROR', err); });
		return pt;
	}
};