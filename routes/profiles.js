
const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const db = require("../db");
const dbName = "data";
const profileCollection = "profile";

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
    router.post("/profiles/:userId/:roomId/:isHost?", (request, response) => {
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

    router.put("/profiles/:userId/:roomId/", (request, response) => {
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
    router.get("/profiles", (request, response) => {
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
