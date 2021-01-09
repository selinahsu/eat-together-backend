# Endpoints
## User
* POST: /users
    * request body example: {"name": "John", "lat": 20.4555, "lon": -94.3243}
* GET: /users/:userId
    * return example: {"_id": {userId}, "name": "John", "lat": 20.4555, "lon": -94.3243}
## Room
* POST: /rooms/:userId
    * generate room, pass in userId of host
* PUT: /rooms/:roomId/:userId/:addPref?
    * userId joins room, optional addPref
    * user finishes adding preferences, addPref should be true
## Profile
* POST: /profiles/:userId/:roomId/:isHost?
    * generate room, pass in userId, roomId, and true
    * join room, pass in userId, roomId
* PUT: /profiles/:userId/:roomId/
    * add preferences in request body, example: 
    {
        "pref": [
            {"type": "cuisine", "string": "korean"},
            {"type": "dietRes", "string": "vegan"}
        ]
    }
## Locations
* GET: /locations/coordinates/:zipCode
    * converts a zipCode to lat/long coordinates
    * return example: {"lat":43.7458412,"lng":-79.3546521}
* POST: /locations/average
    * finds the central point between all user locations
    * request body example: [{"lat":43,"lng":-79}, {"lat":80,"lng":-80}, {"lat":52,"lng":-60}]
    * return example: {"lat":43.7458412,"lng":-79.3546521}
## Restaurants
* GET: /restaurants
    * returns two top restaurant picks based on all user preferences
    * request body example: 
        {
            "avgUserLocation": "43.6540, -79.3803",
            "radius": 200,
            "dietaryPrefs": ["vegetarian", "halal", "dairy-free"],
            "cuisinePrefs": ["Chinese", "Thai", "Indian"],
            "maxPricePrefs": [0, 2, 1]
        }
    * return example: [example-data.json](./example-data.json)

# Geotab
* Use top 25% AvgTimeToPark to remove restaurants with long parking times for people travelling in cars
    * select Latitude, Longitude from UrbanInfrastructure.SearchingForParking where City = "Toronto" order by AvgTimeToPark limit 795;


