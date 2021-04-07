const csv = require('csv-parser');
var fetch = require('./fetchModisDataInJson');
var utils = require('./utils')
const fs = require('fs');

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


	// Avalanche occurance dates
	fs.createReadStream('Dataset.csv')
	  .pipe(csv())
	  .on('data', function (row) {
	  	if(row.OCCURRENCE_DT != "" && row.Sector == "KARGIL")
	  	{
	    	date = utils.formatCsvDate(row.OCCURRENCE_DT);
	    	var file_path = "D:/17103105/Modis/exportedModisDataInJson/" + utils.formatDateForJson(date);
	    	//console.log(date);
	    	//console.log(date + " " + fs.existsSync(file_path));
	    	if (!fs.existsSync(file_path)) 
	    	{
	    		//console.log(date);
	    		var path = "./exportedModisDataInJson";
	    		fetch.start(path, date, privateKey);
	    	}
	    }
	  })
	  .on('end', function () {  
	})
	// var date = "2016-02-21"
	// fetch.start(date, privateKey)

}

function doSynchronousLoop(data, processData, privateKey, done) {
	if (data.length > 0) {
		var loop = function(data, i, processData, privateKey, done) {
			console.log(data[i]);
			processData(data[i], privateKey, function() {
				console.log("callback");
				if (++i < data.length) {
					loop(data, i, processData, privateKey, done);
				} else {
					done();
				}
			});
		};
		loop(data, 0, processData, privateKey, done);
	} else {
		console.log("exit");
		done();
	}
}

main()
// var date = '06-Feb-11';
// testee.main(format(date), privateKey);
// format(testDate)