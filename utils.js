module.exports = {

	createLogFiles: function() {
		var fs = require('fs');

		// error log
		fs.writeFileSync('error.txt', '', function(err) {
				if(err) throw err;
			});

		// Success log
		fs.writeFileSync('info.txt', '', function(err) {
				if(err) throw err;
			});

		console.log('error.txt and info.txt files created. Note dont open till code terminates.');
	},

	// Change yyyy-mm-dd to yyyy_mm_dd
	formatDateForJson: function (date) {

		var arr = date.split("-");

		return arr[0] + "_" + arr[1] + "_" + arr[2];
	},

	// Change dd-mm-yy to yyyy-mm-dd
	formatCsvDate: function(date) {

		// Month Code
		var months = {
		    'Jan' : '01',
		    'Feb' : '02',
		    'Mar' : '03',
		    'Apr' : '04',
		    'May' : '05',
		    'Jun' : '06',
		    'Jul' : '07',
		    'Aug' : '08',
		    'Sep' : '09',
		    'Oct' : '10',
		    'Nov' : '11',
		    'Dec' : '12'
		}
		var arr = date.split("-");
		return ("20" + arr[2] + "-" + months[arr[1]] + "-" + arr[0])
	},

	createFolder: function (path, fs) {

		if (!fs.existsSync(path)){
			    fs.mkdirSync(path);
		}
	},

	exportToJson: function (data, path, fs, product,) {

		var GeoJSON = require('geojson');
		GeoJSON.parse(data, {GeoJSON: 'geo'}, function(geojson){
			fs.writeFileSync(path, JSON.stringify(geojson), function(err) {
			    if (err) throw err;
			    }
			);
		});
	}
	
};