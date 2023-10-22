var express     = require('express');
var app         = express();
var MongoClient = require('mongodb').MongoClient;
//const { MongoClient } = require('mongodb');


// define connection string in this environment
// the name "mongo" comes from the docker link, in the docker-compose.yml
var url = 'mongodb://mongo:27017/dockerdemo';
// var url = 'mongodb://localhost:27017/dockerdemo';
var db;

// connect to MongoDB
MongoClient.connect(url, function (err, database) {
    if(err) { console.log('failed to connect: ' + err); return;}
    db = database;
    //db = database.db("{dockerdemo}");
    console.log("Connected correctly to server!!");
});

// define a route to verify server is running
app.get('/', function (req, res) {
    res.send('Greetings from the server!!');
});

// define route to createMongo where it creates rights to the db
app.get('/createMongo', function (req, res) {

    if (!db) {
        res.status(500).send('Database connection not established');
        return;
    }

    var name = 'user' + Math.floor(Math.random() * 10000);
    var email = name + '@mit.edu';

    var collection = db.collection('customers');
    var doc = {'name': name, 'email': email};
    collection.insert(doc, {w: 1}, function (err, result) {
        console.dir(result);
        res.send(result);
    });
});

// define route to readMongo where it reading from db
app.get('/readMongo', function (req, res) {

    var results = null;
    var collection = db
        .collection('customers')
        .find()
        .toArray(function (err, docs) {
            console.dir(docs);
            res.send(docs);
    });
});

// app runs a listener on port 3000
app.listen(3000);