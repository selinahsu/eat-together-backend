require('dotenv').config();
const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const db = require("../db");
const dbName = "data";
const roomCollection = "room";

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
    router.get("/rooms/:id", (request, response) => {
        const roomId = request.params.id;

        dbCollection.findOne({ _id: userId }, (error, result) => {
            if (error) throw error;
            // return item
            response.json(result);
        });
    });

    // generate room (host) should pass in param for userId
    router.post("/rooms/:userId", (request, response) => {
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
    router.put("/rooms/:roomId/:userId/:addPref?", (request, response) => {
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
    router.get("/rooms", (request, response) => {
        // return updated list
        dbCollection.find().toArray((error, result) => {
            if (error) throw error;
            response.json(result);
        });
    });

}, function(err) {
    throw (err);
});

module.exports = router;
