const mysql = require('mysql');
const md5 = require('md5');
const new_jwt = require('../../helpers/new_jwt.js');

module.exports = {
	method: "post",
	path: "/user/auth/",
	handler: function(env){
		return (request, response)=>{
			
			// return body
			var res = {
				success: true,
				message: 'success',
				data: {}
			};
			
			if(res.success && !request.query.user){
				res.success = false;
				res.message = 'User is missing';
			}
			
			if(res.success && !request.query.password){
				res.success = false;
				res.message = 'Password is missing';
			}
			
			// DB interaction
			if(res.success){
				
				const db = mysql.createConnection({
					host: env.DB_HOST,
					user: env.DB_USER,
					password: env.DB_PASS,
					database: env.DB
				});
				
				var sql = 'SELECT * FROM `users` WHERE (`email` = ? OR `username` = ?) and `password` = ?';
				var data = [request.query.user, request.query.user, md5(request.query.password)];
				db.query(sql, data, (error, result)=>{
					
					if(error){
						
						res.message = error.message;
						res.success = false;
						
					}else if(!result.length){
						
						res.message = 'User not found';
						res.success = false;
						
					}else if(result[0].status !== 'verified'){
						
						res.message = 'User not active';
						res.success = false;
						
					}else{
						
						var token = new_jwt(result[0].uuid, result[0].id, env.TOKEN_SECRET);
						
						res.message = 'User validated';
						res.success = true;
						res.data.token = token;
						
					}
					
					// Output
					response.set('Content-Type', 'application/json');
					response.send(JSON.stringify(res));
					
				});
				
			}else{
				
				// Output
				response.set('Content-Type', 'application/json');
				response.send(JSON.stringify(res));
				
			}
		};
	}
};