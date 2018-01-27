var express = require('express'),
    couchbase = require('couchbase'),
    bodyParser = require('body-parser');

var cluster = new couchbase.Cluster('couchbase://localhost');
var bucket = cluster.openBucket('default');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/person/:id', function(req, res) {
    bucket.get(req.params.id, function(error, result) {
        if (error)
            return res.status(400).send(error);
        res.send(result);
    });
});

app.post('/person/:id', function(req, res) {
    var document = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    };
    bucket.upsert(req.params.id, document, function(error, result) {
        if (error)
            return res.status(400).send(error);
        res.send(result);
    });
});

var server = app.listen(3000, function() {
    console.log('Listening on port %s...', server.address().port);
});