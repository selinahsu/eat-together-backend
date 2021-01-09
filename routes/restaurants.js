require('dotenv').config();
const axios = require('axios');
const express = require('express');

const router = express.Router();

const GCP_API_KEY = process.env.GCP_API_KEY;

const geotab = require('../geotab-parking.json');


/*
	Places API: 
		https://developers.google.com/maps/documentation/javascript/reference/places-service#FindPlaceFromQueryRequest
		https://developers.google.com/places/web-service/search#PlaceSearchRequests 
	Place Details API (for reviews): 
		https://developers.google.com/places/web-service/details
*/


/***************** Find the top 2 restaurants from user prefs *****************/
router.post('/restaurants', findRestaurants, async (req, res) => {
	res.send(res.locals.results);
});

async function findRestaurants(req, res, next) { 
	const avgUserLocation = req.body.avgUserLocation;

	// Concatenated strings for querying:
	const dietaryPrefs = req.body.dietaryPrefs.join('+');
	const cuisinePrefs = req.body.cuisinePrefs.join('+');

	// Set a maxPrice integer between 1 and 4 based on user preferences
	const maxPrice = Math.floor((req.body.maxPricePrefs.reduce((a, b) => a + b, 0)) / (req.body.maxPricePrefs));

	// If transport is by foot, shrink the radius to 500m
	let radius = 3000; 
	if (req.body.transport = 'foot') {
		radius = 500; 
	}

	const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', { 
		params: {
			query: `${dietaryPrefs}+${cuisinePrefs}`,		// google search query
			location: avgUserLocation,						// lat and long coordinates
			radius: radius, 								// radius (in meters) to return results --> REMOVE IF USING RANKBY DISTANCE
			type: 'restaurant',
			rankby: 'prominence', 							// prominence is the default, distance is the other option
			opennow: true,
			minprice: 0,
			maxprice: maxPrice,
			key: GCP_API_KEY
		}
	});
	if (response.data) {
		// geotab stuff
		// remove location if AvgTimeToPark
		// is top 25% of city
		const restaurants = response.data.results;
		const numRestaurants = restaurants.length;

		if (numRestaurants <= 2) {
			res.locals.results = restaurants.slice(0, 2);
		} else {
			const maxRemovals = numRestaurants - 2;
			let numRemoved = 0;
			let newRestaurants = [];

			for (let i = 0; i < numRestaurants && numRemoved < maxRemovals; i++) {
				const latRes = restaurants[i].geometry.location.lat.toFixed(3);
				const lngRes = restaurants[i].geometry.location.lng.toFixed(3);
				let removed = false;

				for (loc of geotab) {
					if (loc.Latitude == latRes && loc.Longitude == lngRes) {
						numRemoved++;
						removed = true;
						break
					}
				}

				if (!removed) {
					newRestaurants.push(restaurants[i]);
				}
			}

			res.locals.results = newRestaurants.slice(0, 2)
		}
		
	  	next();
	}
	else {
		res.send('Something went wrong.');
	}
}


/***************** Get 5 reviews for a specific place *****************/
router.get('/restaurants/review/:placeId', getReview, async (req, res) => {
	res.send(res.locals.results);
});

async function getReview(req, res, next) {
	const placeId = req.params.placeId;

	const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', { 
		params: {
			place_id: placeId,
			fields: 'name,rating,price_level,reviews',
			key: GCP_API_KEY
		}
	});
	if (response.data) {
		res.locals.results = response.data.result;
		next();
	}
	else {
		res.send('Something went wrong.');
	}
}


module.exports = router;
