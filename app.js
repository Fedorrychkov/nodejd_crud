var express = require('express'),
    nano = require('nano')('http://localhost:5984'),
    bodyParser = require('body-parser');

var articleNode = nano.db.use('articles');
articleNode.update = function(obj, key, callback){
    var db = this;
    db.get(key, function (error, existing){ 
       if(!error) obj._rev = existing._rev;
       db.insert(obj, key, callback);
    });
};

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Get All Articles
 */
app.get('/articles', function(req, res) {
    articleNode.get('_design/all_articles/_view/all', function(error, result) {
        if (error)
            return res.status(400).send(error);
        res.send(result);
    });
});
/**
 * Get Article by id
 */
app.get('/articles/:id', function(req, res) {
    articleNode.get(req.params.id, function(error, result) {
        if (error)
            return res.status(400).send(error);
        res.send(result);
    });
});
/**
 * Create Article
 */
app.post('/articles', function(req, res) {
    // console.log(req.body);
    articleNode.insert(req.body, function(error, result) {
        if (error)
            return res.status(400).send(error);
        res.send(result);
    });
});
/**
 * Update Article by id
 */
app.put('/articles/:id', function(req, res) {
    // console.log(req.body, req.params.id);
    articleNode.update(req.body, req.params.id, function(error, result){
        if (error)
            return res.status(400).send(error);
        res.send(result);
    });
});
/**
 * Delete Article by id and rev
 */
app.delete('/articles/:id/:rev', function(req, res) {
    // console.log(req.params);
    articleNode.destroy(req.params.id, req.params.rev, function(error, result) {
        if (error)
            return res.status(400).send(error);
        res.send(result);
    });
});

var server = app.listen(3000, function() {
    console.log('Listening on port %s...', server.address().port);
});