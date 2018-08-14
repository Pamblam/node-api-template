const mysql = require('mysql');

module.exports = {
	method: "get",
	path: "/user/confirm/",
	handler: function(env){
		return (request, response)=>{
			
			// return body
			var res = {
				success: true,
				message: 'success',
				data: {}
			};
			
			if(res.success && !request.query.email){
				res.success = false;
				res.message = 'Email is missing';
			}
			
			if(res.success && !request.query.uuid){
				res.success = false;
				res.message = 'UUID is missing';
			}
			
			// DB interaction
			if(res.success){
				
				const db = mysql.createConnection({
					host: env.DB_HOST,
					user: env.DB_USER,
					password: env.DB_PASS,
					database: env.DB
				});
				
				var sql = 'SELECT * FROM `users` WHERE `email` = ? and `uuid` = ?';
				var data = [request.query.email, request.query.uuid];
				db.query(sql, data, (error, result)=>{
					
					if(error){
						
						res.message = error.message;
						res.success = false;
						
						// Output
						response.set('Content-Type', 'application/json');
						response.send(JSON.stringify(res));
						
					}else if(!result.length){
						
						res.message = 'User not found';
						res.success = false;
						
						// Output
						response.set('Content-Type', 'application/json');
						response.send(JSON.stringify(res));
					
					} else {
						
						var sql = 'UPDATE `users` set `status` = ? WHERE `email` = ? and `uuid` = ?';
						var data = ['verified', request.query.email, request.query.uuid];
						db.query(sql, data, (error, result)=>{
							
							if(error){
						
								res.message = error.message;
								res.success = false;
								
							}else{
								
								res.message = 'Email confirmed';
								res.success = true;
								
							}
							
							// Output
							response.set('Content-Type', 'application/json');
							response.send(JSON.stringify(res));
								
						});
						
					}
					
				});
				
			}else{
				
				// Output
				response.set('Content-Type', 'application/json');
				response.send(JSON.stringify(res));
				
			}
		};
	}
};