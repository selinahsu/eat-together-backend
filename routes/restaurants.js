require('dotenv').config();
const axios = require('axios');
const express = require('express');
const ObjectId = require('mongodb').ObjectId;

const db = require("../db");
const dbName = "data";
const restaurantCollection = "restaurant";


const router = express.Router();

const GCP_API_KEY = process.env.GCP_API_KEY;

const geotab = require('../geotab-parking.json');

db.initialize(dbName, restaurantCollection, function(dbCollection) {
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          //console.log(result);
    });

	/* get restaurants */
	router.post('/restaurants/:roomId', findRestaurants, async (req, res) => {
		const roomId = req.params.roomId;

		for (obj of res.locals.results) {
			const restaurant = obj;
			restaurant['roomId'] = roomId;
			restaurant['numYes'] = 0;
			restaurant['numNo'] = 0;

			dbCollection.insertOne(restaurant, (error, result) => {
				if (error) throw error;
				// res.status(201).send(profile)
			});
		}
		res.send(res.locals.results);
	});

	/* get top 2 restaurants */
	router.get('/restaurants/top2/:roomId', (req, res) => {
		const roomId = req.params.roomId;
		let restaurants = [];

        dbCollection.find({roomId: roomId}).toArray((error, result) => {
			if (error) throw error;
			
			// calculate scores
			restaurants = result;
			let maxScore = 0;
			let secondMaxScore = 0;
			let maxScoreInd = 0;
			let secondMaxScoreInd = 0;

			for (let i = 0; i < restaurants.length; i++) {
				const restaurant = restaurants[i];
				let total = (restaurant.numYes + restaurant.numNo) == 0 ? 1 : (restaurant.numYes + restaurant.numNo)
				let score = (restaurant.numYes / total) * 100
				if (score > maxScore) {
					maxScore = score;
					maxScoreInd = i;
				} else if (score > secondMaxScore) {
					secondMaxScore = score;
					secondMaxScoreInd = i;
				}
			}

			let returnObj = {};
			let best = restaurants[maxScoreInd];
			let secondBest = restaurants[secondMaxScoreInd];

			best['score'] = maxScore;
			secondBest['score'] = secondMaxScore;
			returnObj['best'] = best;
			returnObj['second'] = secondBest;
			
			res.json(returnObj);
		});
    
	});

	router.put('/restaurants/:restaurantId/:roomId/:yes', (req, res) => {
        const roomId = req.params.roomId;
        const restaurantId = new ObjectId(req.params.restaurantId);
		const yes = (req.params.yes === "true");

		if (yes) {
			dbCollection.updateOne(
				{ roomId: roomId, _id: restaurantId },
				{ $inc: { numYes: 1 } },
				(error, result) => {
				if (error) throw error;
				// return item
				res.json(result);
			});
		} else {
			dbCollection.updateOne(
				{ roomId: roomId, _id: restaurantId },
				{ $inc: { numNo: 1 } },
				(error, result) => {
				if (error) throw error;
				// return item
				res.json(result);
			});
		}
    });
	
}, function(err) {
    throw (err);
});

async function findRestaurants(req, res, next) { 
	const avgUserLocation = req.body.avgUserLocation;
	const radius = req.body.radius;

	// Concatenated preferences:
	const dietaryString = req.body.dietaryPrefs.join('+');
	const cuisineString = req.body.cuisinePrefs.join('+');
	const maxPrice = req.body.maxPricePrefs.reduce((a, b) => a + b, 0);
	const driving = false || (req.body.transportationPrefs.includes('car'));

	/*
	Places API Documentation: 
		https://developers.google.com/maps/documentation/javascript/reference/places-service#FindPlaceFromQueryRequest
		https://developers.google.com/places/web-service/search#PlaceSearchRequests 
	*/
	const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', { 
		params: {
			query: `${dietaryString}+${cuisineString}`,		// google search query
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

		// we need at least 2 restaurants, don't care about parking
		// if not driving
		if (numRestaurants <= 2 || !driving) {
			res.locals.results = restaurants;
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

			res.locals.results = newRestaurants;
		}
		
	  	next();
	}
	else {
		res.send('Something went wrong.');
	}
}

module.exports = router;
