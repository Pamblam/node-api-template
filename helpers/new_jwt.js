require('protodate');
const jwt = require('jwt-simple');

module.exports = function(uuid, uid, secret){
	return jwt.encode({
		expires: new Date().plus(7, Date.DAY).format('U'),
		uuid: uuid,
		uid: uid,
	}, secret);
};