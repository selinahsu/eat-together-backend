const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const db = require("../db");
const dbName = "data";
const userCollection = "user";

db.initialize(dbName, userCollection, function(dbCollection) {
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          console.log(result);
    });

    /* get ALL users */
    router.get('/users', (req, res) => {
        // return updated list
        dbCollection.find().toArray((error, result) => {
            if (error) throw error;
            res.json(result);
        });
    });

    /* get user by userid */
    router.get("/users/:id", (req, res) => {
        const userId = new ObjectId(req.params.id);

        dbCollection.findOne({ _id: userId }, (error, result) => {
            if (error) throw error;
            // return item
            res.json(result);
        });
    });
    
    /* create user */
    router.post("/users", (req, res) => {
        const user = req.body;
        dbCollection.insertOne(user, (error, result) => {
            if (error) throw error;
            res.status(201).send(user)
        });
    });

}, function(err) {
    throw (err);
});

module.exports = router;
