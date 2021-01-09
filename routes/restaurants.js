require('dotenv').config();
const axios = require('axios');
const express = require('express');

const router = express.Router();

const GCP_API_KEY = process.env.GCP_API_KEY;

const geotab = require('../geotab-parking.json');

router.get('/restaurants', findRestaurants, async (req, res) => {
	res.send(res.locals.results);
});

async function findRestaurants(req, res, next) { 
	const avgUserLocation = '43.6540, -79.3803'; // replace with req.body.params.location;
	const radius = 200; // replace with req.body.params.radius;
	
	const dietaryPrefs = ['vegetarian', 'halal', 'dairy-free']; // replace with req.body.params.diet;
	const cuisinePrefs = ['Chinese', 'Thai', 'Indian']; // replace with req.body.params.cuisineType;
	const maxPricePrefs = [0, 2, 3, 1, 2, 1];

	// Concatenated preferences:
	const dietaryString = dietaryPrefs.join('+');
	const cuisineString = cuisinePrefs.join('+');
	const maxPrice = maxPricePrefs.reduce((a, b) => a + b, 0);

	/*
	Places API Documentation: 
		https://developers.google.com/maps/documentation/javascript/reference/places-service#FindPlaceFromQueryRequest
		https://developers.google.com/places/web-service/search#PlaceSearchRequests 
	*/
	const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', { 
		params: {
			query: `${dietaryPrefs}+${cuisinePrefs}`,		// google search query
			location: avgUserLocation,									// lat and long coordinates
			radius: radius, 														// radius (in meters) to return results --> REMOVE IF USING RANKBY DISTANCE
			type: 'restaurant',
			rankby: 'prominence', 											// prominence is the default, distance is the other option
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

module.exports = router;
