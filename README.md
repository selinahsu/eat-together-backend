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