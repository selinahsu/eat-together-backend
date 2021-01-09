require('dotenv').config();
const express = require('express');
const router = express.Router();

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
    router.get("/rooms/:id", (req, res) => {
        const roomId = req.params.id;

        dbCollection.findOne({ _id: userId }, (error, result) => {
            if (error) throw error;
            // return item
            res.json(result);
        });
    });

    // generate room (host) should pass in param for userId
    router.post("/rooms/:userId", (req, res) => {
        const roomId = makeRoomCode(5);
        const hostId = req.params.userId

        const room = {
            "roomId": roomId,
            "userIds": [hostId],
            "usersAddPref": []
        }

        dbCollection.insertOne(room, (error, result) => { // callback of insertOne
            if (error) throw error;
            res.status(201).send(room)
        });
    });

    // join room: /rooms/ABCDE/<userId> --> add user to room
    // finished adding preferences: /rooms/ABCDE/<userId>/true
    router.put("/rooms/:roomId/:userId/:addPref?", (req, res) => {
        const roomId = req.params.roomId;
        const userId = req.params.userId;
        const addPref = false || req.params.addPref;

        addPref ?
        dbCollection.updateOne(
            { roomId: roomId },
            { $push: { "usersAddPref": userId } },
            (error, result) => {
            if (error) throw error;
            // return item
            res.json(result);
        })
        :
        dbCollection.updateOne(
            { roomId: roomId },
            { $push: { "userIds": userId } },
            (error, result) => {
            if (error) throw error;
            // return item
            res.json(result);
        });
    });


    // DEBUG, display all rooms
    router.get("/rooms", (req, res) => {
        // return updated list
        dbCollection.find().toArray((error, result) => {
            if (error) throw error;
            res.json(result);
        });
    });

}, function(err) {
    throw (err);
});

module.exports = router;
