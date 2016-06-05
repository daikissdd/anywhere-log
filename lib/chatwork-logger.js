'use strict';

const request = require('superagent');
const url = (roomId) => {
	return ['https://api.chatwork.com/v1/rooms/', roomId, '/messages'].join('');
};

const postChatworkMessage = (apiToken, roomId, title, msg, to) => {
	let body = ['[info][title]', title, '[/title]', msg, '[/info]'];
	if (typeof to === 'string') body.unshift(to);
	return new Promise((resolve, reject) => {
		request
			.post(url(roomId))
			.type('form')
			.set('X-ChatWorkToken', apiToken)
			.send({body: body.join('')})
			.end((err, res) => {
				if (!err && res.statusCode == 200) return resolve(res);
				return reject(err);
			});
	});
};

postChatworkMessage.getRecents = (apiToken, roomId) => {
	return new Promise((resolve, reject) => {
		request
			.get(url(roomId))
			.set('X-ChatWorkToken', apiToken)
			.end((err, res) => {
				if (!err) return resolve(res);
				return reject(err);
		});
	})
};

module.exports = postChatworkMessage;