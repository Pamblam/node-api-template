const mysql = require('mysql');
const nodemailer = require('nodemailer');
const md5 = require('md5');

module.exports = {
	method: "post",
	path: "/user/create/",
	handler: function(env){
		return (request, response)=>{
			
			// return body
			var res = {
				success: true,
				message: 'success',
				data: {}
			};
			
			// validate input
			if(res.success && !request.query.username){
				res.success = false;
				res.message = 'Must provide username.';
			}
			
			if(res.success && !request.query.email){
				res.success = false;
				res.message = 'Must provide email.';
			}
			
			if(res.success && !request.query.password){
				res.success = false;
				res.message = 'Must provide password.';
			}
			
			if(res.success && request.query.username.length > 15){
				res.success = false;
				res.message = 'Username must be less than 15 chars';
			}
			
			if(res.success && request.query.username.length < 3){
				res.success = false;
				res.message = 'Username must be at least 3 chars';
			}
			
			if(res.success && request.query.password.length < 6){
				res.success = false;
				res.message = 'Password must be at least 6 chars';
			}
			
			if(res.success && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(request.query.email)){
				res.success = false;
				res.message = 'Must provide a valid email';
			}
			
			// DB interaction
			if(res.success){
				const db = mysql.createConnection({
					host: env.DB_HOST,
					user: env.DB_USER,
					password: env.DB_PASS,
					database: env.DB
				});
				
				var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
					var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
				
				var sql = 'INSERT INTO `users` (`email`, `username`, `password`, `uuid`, `status`) VALUES (?, ?, ?, ?, ?)';
				var data = [request.query.email, request.query.username, md5(request.query.password), uuid, 'pending'];
				
				db.query(sql, data, (error, result)=>{
					
					if(error){
						
						res.message = error.message;
						res.success = false;
						
						// Output
						response.set('Content-Type', 'application/json');
						response.send(JSON.stringify(res));
						
					}else{
						
						nodemailer.createTransport({
							sendmail: true,
							newline: 'unix',
							path: '/usr/sbin/sendmail'
						}).sendMail({
							from: env.FROM_EMAIL,
							to: request.query.email,
							subject: 'Welcome to my cool API',
							html: `<p>Welcome ${request.query.username}</p>
									<p>Please confirm your email by clicking <a href='${env.URL}:${env.PORT}/user/confirm/?email=${encodeURIComponent(request.query.email)}&uuid=${encodeURIComponent(uuid)}'>here...</a></p>`
						}, (err, info) => {
							
							if(err){
								res.message = err.message;
								res.success = false;
							}else{
								res.message = 'Account Pending. Check Email.';
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