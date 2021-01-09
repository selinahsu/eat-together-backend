require('dotenv').config();
const axios = require('axios');
const express = require('express');

const router = express.Router();

const API_KEY = process.env.GCP_API_KEY;


router.get('/restaurants', findRestaurants, async (req, res) => {
	res.send(res.locals.results);
});

/***************** Middleware *****************/

async function findRestaurants(req, res, next) { 
	const location = '43.6540, -79.3803'; // replace with req.body.params.location;
	const radius = 50; // replace with req.body.params.radius;
	const diet = 'vegetarian'; // replace with req.body.params.diet;
	const cuisineType = 'Chinese'; // replace with req.body.params.cuisineType;

	/*
	places api documentation: 
		https://developers.google.com/maps/documentation/javascript/reference/places-service#FindPlaceFromQueryRequest
		https://developers.google.com/places/web-service/search#PlaceSearchRequests 
	*/
	const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', { 
		params: {
			query: `${diet}+${cuisineType}`,		// google search query
			location: location,									// lat and long coordinates
			radius: radius, 										// radius (in meters) to return results --> REMOVE IF USING RANKBY DISTANCE
			type: 'restaurant',
			rankby: 'prominence', 							// prominence is the default, distance is the other option
			key: API_KEY
		}
	});
	if (response.data) {
	  res.locals.results = response.data.results.slice(0, 3);
	  next();
	}
	else {
		res.send('Something went wrong.');
	}
}

module.exports = router;