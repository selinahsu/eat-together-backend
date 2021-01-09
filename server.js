require('dotenv').config();
const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

// parse JSON (application/json content-type)
app.use(bodyParser.json());

const cors = require('cors');
const path = require('path');

const restaurantRoutes = require('./routes/restaurants');

// db setup
const db = require("./db");
const dbName = "data";
const userCollection = "user";
const roomCollection = "room";
const profileCollection = "profile";

/* USERS */
db.initialize(dbName, userCollection, function(dbCollection) {
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          console.log(result);
    });

    app.post("/users", (request, response) => {
        const user = request.body;
        dbCollection.insertOne(user, (error, result) => {
            if (error) throw error;
            response.status(201).send(user)
        });
    });

    app.get("/users/:id", (request, response) => {
        const userId = new ObjectId(request.params.id);

        dbCollection.findOne({ _id: userId }, (error, result) => {
            if (error) throw error;
            // return item
            response.json(result);
        });
    });

}, function(err) {
    throw (err);
});


/* ROOMS */
// create random room code, pass in 5 for length
function makeRoomCode(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

db.initialize(dbName, roomCollection, function(dbCollection) {
    // get all items
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          console.log(result);
    });

    // routes
    // get room, should pass in param for userId
    app.get("/rooms/:id", (request, response) => {
        const roomId = request.params.id;

        dbCollection.findOne({ _id: userId }, (error, result) => {
            if (error) throw error;
            // return item
            response.json(result);
        });
    });

    // generate room (host) should pass in param for userId
    app.post("/rooms/:userId", (request, response) => {
        const roomId = makeRoomCode(5);
        const hostId = request.params.userId

        const room = {
            "roomId": roomId,
            "userIds": [hostId],
            "usersAddPref": []
        }

        dbCollection.insertOne(room, (error, result) => { // callback of insertOne
            if (error) throw error;
            response.status(201).send(room)
        });
    });

    // join room: /rooms/ABCDE/<userId> --> add user to room
    // finished adding preferences: /rooms/ABCDE/<userId>/true
    app.put("/rooms/:roomId/:userId/:addPref?", (request, response) => {
        const roomId = request.params.roomId;
        const userId = request.params.userId;
        const addPref = false || request.params.addPref;

        addPref ?
        dbCollection.updateOne(
            { roomId: roomId },
            { $push: { "usersAddPref": userId } },
            (error, result) => {
            if (error) throw error;
            // return item
            response.json(result);
        })
        :
        dbCollection.updateOne(
            { roomId: roomId },
            { $push: { "userIds": userId } },
            (error, result) => {
            if (error) throw error;
            // return item
            response.json(result);
        });
    });


    // DEBUG, display all rooms
    app.get("/rooms", (request, response) => {
        // return updated list
        dbCollection.find().toArray((error, result) => {
            if (error) throw error;
            response.json(result);
        });
    });

}, function(err) {
    throw (err);
});

/* PROFILES */
// TODO: randomly choose url for dp
function getImageUrl() {
    var urls = [];
    return "";
}

db.initialize(dbName, profileCollection, function(dbCollection) {
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          console.log(result);
    });

    // generate room: after POST room, pass in userId, roomId, and true
    // join room: after PUT room, pass in userId and roomId
    app.post("/profiles/:userId/:roomId/:isHost?", (request, response) => {
        const userId = request.params.userId;
        const roomId = request.params.roomId;
        const isHost = false || request.params.isHost;

        const profile = {
            "userId": userId,
            "roomId": roomId,
            "pref": [],
            "isHost": isHost,
            "imgUrl": getImageUrl()
        }

        dbCollection.insertOne(profile, (error, result) => { // callback of insertOne
            if (error) throw error;
            response.status(201).send(profile)
        });
    });

    app.put("/profiles/:userId/:roomId/", (request, response) => {
        const roomId = request.params.roomId;
        const userId = request.params.userId;
        const pref = request.body.pref;

        dbCollection.updateOne(
            { userId: userId, roomId: roomId },
            { $set: { "pref": pref } },
            (error, result) => {
            if (error) throw error;
            // return item
            response.json(result);
        });
    });

    // DEBUG, see all profiles
    app.get("/profiles", (request, response) => {
        // return updated list
        dbCollection.find().toArray((error, result) => {
            if (error) throw error;
            response.json(result);
        });
    });
}, function(err) {
    throw (err);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
