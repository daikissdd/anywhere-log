'use strict';

const _ = require('lodash');
const os = require('os');
const log = require('./log');
const newLogger = (name) => log.module(name);
const memory = () => {
	let l = newLogger('memory');
	let toGB = (val) => [(val / 1024 / 1024 / 1024).toFixed(1), 'GB'].join('');
	let heapTotal = process.memoryUsage().heapTotal;
	let heapUsed = process.memoryUsage().heapUsed;

	l.info({
		systemTotalMemory: toGB(os.totalmem()),
		systemFreeMemory: toGB(os.freemem()),
		processUsingMemory: toGB(process.memoryUsage().rss),
		heapTotal: toGB(heapTotal),
		heapUsed: toGB(heapUsed),
		heapFree: toGB(heapTotal - heapUsed),
	});
};
const getCaller = (stackIndex) => {
	const callerInfo = {};
	const saveLimit = Error.stackTraceLimit;
	const savePrepare = Error.prepareStackTrace;

	stackIndex = (stackIndex - 0) || 1;

	Error.stackTraceLimit = stackIndex + 1;
	Error.captureStackTrace(this, getCaller);
	Error.prepareStackTrace = (_, stack) => {
		const caller = stack[stackIndex];
		callerInfo.file = caller.getFileName();
		callerInfo.line = caller.getLineNumber();
		const func = caller.getFunctionName();
		if (func) {
			callerInfo.func = func;
		}
	};
	this.stack;
	Error.stackTraceLimit = saveLimit;
	Error.prepareStackTrace = savePrepare;
	log.error(callerInfo);
	return callerInfo;
};

/*
log.info()
log.notice()
log.warn()
log.error()
log.critical()
*/
const okLog = {trace: () => 'ok'};
exports.logAndIs = (name) => {
	let l = newLogger(_.isUndefined(name) ? 'NULL' : name);
	let ll = newLogger(_.isUndefined(name) ? 'NULL' : name);
	l.withSource();
	
	l.memory = memory;
	l.trace = getCaller;
	
	l.isArray = (value) => {
		if (_.isArray(value)) return okLog;
		ll.error('Not Array', {value});
		return l;
	};
	l.isNumber = (value) => {
		if (_.isNumber(value)) return okLog;
		ll.error('Not Number', {value});
		return l;
	};
	l.isString = (value) => {
		if (_.isString(value)) return okLog;
		ll.error('Not String', {value});
		return l;
	};
	l.isUndefined = (value) => {
		if (_.isUndefined(value)) return okLog;
		ll.error('Not Undefined', {value});
		return l;
	};
	l.isNull = (value) => {
		if (_.isNull(value)) return okLog;
		ll.error('Not Null', {value});
		return l;
	};
	l.isHas = (value, key) => {
		if (_.has(value, key)) return okLog;
		ll.error('Not Has', {value, key});
		return l;
	};
	l.isTrue = (value) => {
		if (value) return okLog;
		ll.error('Not True', {value});
		return l;
	};
	
	if (process.env.NODE_ENV === 'test') {
		l.info = () => '';
		l.notice = () => '';
		l.warn = () => '';	
	}

	return l;
};

