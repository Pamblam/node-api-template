var fs = require('fs');
var path = require('path');

function read_directory(dir) {
	return new Promise((resolve,reject)=>{
		var results=[];
		fs.readdir(dir, (err, list)=>{
			if(err) return reject(err);
			var pending = list.length;
			if(!pending) return resolve(results);
			list.forEach(file=>{
				file = path.resolve(dir, file);
				fs.stat(file, (err, stat)=>{
					if(stat && stat.isDirectory()){
						read_directory(file).then(res=>{
							results = results.concat(res);
							if(!--pending) resolve(results);
						}, reject);
					}else{
						results.push(file);
						if (!--pending) resolve(results);
					}
				});
			});
		});
	});
}

module.exports = read_directory;