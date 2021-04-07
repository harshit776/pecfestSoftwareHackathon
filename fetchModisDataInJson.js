module.exports = {

	getFeatures: function (product, date, features, geometry, ee) {

		var dataset = ee.ImageCollection(product)
		         .filter(ee.Filter.date(date))
		         .filter(ee.Filter.bounds(geometry))
		         .select(features);
		var dailyImg = dataset.toBands();
		var collection = dailyImg.sample({
			region: geometry,
			geometries: true,  // This specifies that you want the lat-long.
		});

		// Break point coordinates up into properties (table columns) explicitly.
		var collection_with_latlon = collection.map(function (feature) {
		var coordinates = feature.geometry().transform('epsg:4326').coordinates();
			return feature.set('lon', coordinates.get(0), 'lat', coordinates.get(1));
		});

		return collection_with_latlon;
	},

	createJson: function (path, date, ee) {

		const fs = require('fs');
		var rimraf = require("rimraf");
		var utils = require('./utils')
		
		// Drass region co-ordinates
		var geometry = 
	    /* color: #ff00ff */
	    /* displayProperties: [
	      {
	        "type": "rectangle"
	      }
		] */

		// Kargil
		ee.Geometry.Polygon(
			[[[76.13112850043623, 34.554408626874135],
           [76.13112850043623, 34.55069736525187],
           [76.13919658515303, 34.55069736525187],
           [76.13919658515303, 34.554408626874135]]], null, false);

		// Batalik
		// ee.Geometry.Polygon(
		// 	[[[76.33465910947231, 34.65970374668788],
  //          [76.33465910947231, 34.65214925202861],
  //          [76.35075236356167, 34.65214925202861],
  //          [76.35075236356167, 34.65970374668788]]], null, false);

		// Drass
	    // ee.Geometry.Polygon(
	    //     [[[75.7393891923022, 34.4320133503785],
	    //       [75.7393891923022, 34.425429346304426],
	    //       [75.7573278061938, 34.425429346304426],
	    //       [75.7573278061938, 34.4320133503785]]], null, false);

		// var date = '2017-02-04'
		var mod09 = module.exports.getFeatures('MODIS/006/MOD09GQ', date, ['sur_refl_b01', 'sur_refl_b02'], geometry, ee)
		var mod10 = module.exports.getFeatures('MODIS/006/MOD10A1', date, ['NDSI'], geometry, ee)
		var mod11 = module.exports.getFeatures('MODIS/006/MOD11A1', date, ['LST_Day_1km', 'LST_Night_1km'], geometry, ee)

		utils.createFolder(path, fs);
		formattedDate = utils.formatDateForJson(date);
		absPath = path + '/' + formattedDate;
		utils.createFolder(absPath, fs);

		// Export to json 
		try {
			utils.exportToJson(mod09.getInfo(), absPath + "/sur_refl.json", fs, date + '_MOD09GQ');
			utils.exportToJson(mod10.getInfo(), absPath + "/ndsi.json", fs, date + '_MOD10A1');
			utils.exportToJson(mod11.getInfo(), absPath + "/lst.json", fs, date + '_MOD011A1');
			fs.appendFileSync('info.txt', date + '\n', function(err) {
				if(err) throw err;
			});
			console.log(date + '-------> success');

			return true;
		}

		catch (e) {
			var errorLog = date + ": " + e;
			fs.appendFileSync('error.txt', errorLog + '\n', function(err) {
				if(err) throw err;
			});
			rimraf.sync(absPath);
			console.log(date + '--------> error');
			return false;
		}
	},

	start: function (path, date, privateKey) {

		// Load client library
		var ee = require('@google/earthengine');

		// Initialize client library and run analysis.
		var runAnalysis = function() {
		 ee.initialize(null, null, function() {
		    module.exports.createJson(path, date, ee);
		  }, function(e) {
		    console.error('Initialization error: ' + e);
		  });
		};

		// Authenticate using a service account.
		ee.data.authenticateViaPrivateKey(privateKey, runAnalysis, function(e) {
		  console.error('Authentication error: ' + e);
		});
	}
};