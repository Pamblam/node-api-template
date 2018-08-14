const validate_jwt = require('../../helpers/validate_jwt.js');

module.exports = {
	method: "get",
	path: "/example/random_num/",
	handler: function(env){
		return (request, response)=>{
			
			// return body
			var res = {
				success: true,
				message: 'success',
				data: {}
			};
			
			if(res.success && !request.query.token){
				res.success = false;
				res.message = 'Access token is missing';
			}
			
			if(res.success){
				
				validate_jwt(env, request.query.token).then(valid=>{
					
					if(valid){
						
						res.success = true;
						res.message = 'Number generated';
						res.data.number = Math.floor(Math.random() * 20);
						
					}else{
						
						res.success = false;
						res.message = 'Access token is invalid or expired';
						
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