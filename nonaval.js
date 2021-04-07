const csv = require('csv-parser');
var fetch = require('./fetchModisDataInJson');
var utils = require('./utils')
const fs = require('fs');
var moment = require('moment');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function main() {

	// Private key for earth engine authentication 
	var privateKey = require('./modis-303708-2758abb4d204.json');

	// Log files
	utils.createLogFiles();

	// Non-Avalanche occurance dates

	var a = moment('2000-01-01');
	var b = moment('2019-01-01');

	// If you want an exclusive end date (half-open interval)
	for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
		date = m.format('YYYY-MM-DD');

		var filePath = "D:/17103105/Modis/exportedModisDataInJson/" + utils.formatDateForJson(date);
		var filePathNonAval = "D:/17103105/Modis/nonAvalModisData/" + utils.formatDateForJson(date);
		//console.log(date + " " + fs.existsSync(file_path));
		if (!fs.existsSync(filePath) && !fs.existsSync(filePathNonAval)) 
		{
			//console.log(date + " " + fs.existsSync(file_path));
			var path = "./nonAvalModisData"
			fetch.start(path, date, privateKey);
		}
	}

	// var date = "2016-02-21"
	// fetch.start(date, privateKey)

}

main()
// var date = '06-Feb-11';
// testee.main(format(date), privateKey);
// format(testDate)