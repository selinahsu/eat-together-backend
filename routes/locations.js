require('dotenv').config();
const axios = require('axios');
const express = require('express');

const router = express.Router();

const GCP_API_KEY = process.env.GCP_API_KEY;

/*
Geocoding API Documentation: 
	https://developers.google.com/maps/documentation/geocoding
*/


/***************** Convert a zip code to coordinates *****************/
router.get('/locations/coordinates/:zipCode', getCoordinatesFromZipCode, async (req, res) => {
	res.send(res.locals.zipCode);
});

async function getCoordinatesFromZipCode(req, res, next) { 
	const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', { 
		params: {
			address: req.params.zipCode,
			key: GCP_API_KEY
		}
	});
	if (response.data) {
		res.locals.zipCode = response.data.results[0].geometry.location;
		next();
	}
	else {
		res.send('Something went wrong.');
	}
}


/***************** Find avg location of all users *****************/
router.post('/locations/average', findAverageLocation, async (req, res) => {
	res.send(res.locals.avgLocation);
});

async function findAverageLocation(req, res, next) {	
	const locations = req.body;
	const locationCount = locations.length;

	let latitudeSum = 0, longitudeSum = 0;
	locations.forEach((location) => {
		latitudeSum += location.lat;
		longitudeSum += location.lng;
	});
	
	// Save averaged location to res.locals:
	res.locals.avgLocation = {
		"lat": latitudeSum/locationCount,
		"lng": longitudeSum/locationCount
	};

	next();
}


module.exports = router;
