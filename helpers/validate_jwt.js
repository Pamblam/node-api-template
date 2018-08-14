require('protodate');
const jwt = require('jwt-simple');
const mysql = require('mysql');

module.exports = function(env, token){
	return new Promise(done=>{
		var decoded = jwt.decode(token, env.TOKEN_SECRET);
		if(!decoded) return done(false);
		var now = new Date().format('U');
		if(decoded.expires < now) return done(false);
		const db = mysql.createConnection({
			host: env.DB_HOST,
			user: env.DB_USER,
			password: env.DB_PASS,
			database: env.DB
		});
		var sql = 'SELECT * FROM `users` WHERE `id` = ? AND `uuid` = ?';
		var data = [decoded.uid, decoded.uuid];
		db.query(sql, data, (error, result)=>{
			done(!!result.length);
		});
	});
};