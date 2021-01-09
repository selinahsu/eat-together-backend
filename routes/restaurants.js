require('dotenv').config();
const axios = require('axios');
const express = require('express');

const router = express.Router();

const GCP_API_KEY = process.env.GCP_API_KEY;


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
		https://developers.google.com/places/web-service/supported_types
	Place Details API (for potentially including reviews): 
		https://developers.google.com/places/web-service/details
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
	  res.locals.results = response.data.results.slice(0, 2);
	  next();
	}
	else {
		res.send('Something went wrong.');
	}
}

module.exports = router;
