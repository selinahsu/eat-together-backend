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
	const radius = 50; // replace with req.body.params.radius;
	
	// Array of dietary preferences:
	const dietaryPrefs = ['vegetarian', 'halal', 'dairy-free']; // replace with req.body.params.diet;
	// Concatenated string of dietary preferences:
	const dietaryString = dietaryPrefs.join('+');

	// Array of cuisine preferences:
	const cuisinePrefs = ['Chinese', 'Thai', 'Indian']; // replace with req.body.params.cuisineType;
	// Concatenated string of cuisine preferences:
	const cuisineString = cuisinePrefs.join('+');

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
			maxprice: 3,
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
