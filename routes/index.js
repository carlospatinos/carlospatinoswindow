var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post('/myview', function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var signum = req.body.signum;
    req.session.signum = signum;

    // Set our collection
    var collection = db.get('skills');
    collection.find({},{},function(e,docs){
        res.render('myview', {
            "skillsList" : docs
        });
    });
});


router.post('/storePersonalAttributes', function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;

    // Set our collection
    var collection = db.get('attributesPerPersonByDate');

    // Submit to the DB
    
    collection.insert({
        "person" : req.session.signum,
        "attributes" : req.body
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            //res.redirect("linkWithPersonalView");
            res.render('linkWithPersonalView', {
                "attributes" : req.body
            });
        }
    });

});


router.get('/skills', function(req, res, next) {
    var db = req.db;
    var collection = db.get('skills');
    collection.find({},{},function(e,docs){
        res.render('skills', {
            "skillsList" : docs
        });
    });
});

/*
router.get('/linkWithPersonalView', function(req, res, next) {
    res.render('linkWithPersonalView', { title: 'Summary' });
});*/





/* GET New User page. */
router.get('/newskill', function(req, res, next) {
    res.render('newskill', { title: 'Add New Skill' });
});

/* POST to Add User Service */
router.post('/skills', function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var skillTitle = req.body.skillTitle;

    // Set our collection
    var collection = db.get('skills');

    // Submit to the DB
    
    collection.insert({
        "skillTitle" : skillTitle
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("skills");
        }
    });


/*var conf = ['able', 'accepting', 'adaptable', 'bold', 'brave', 'calm', 'caring', 'cheerful', 'clever', 'complex', 'bad', 'confident', 'dependable', 'dignified', 'energetic', 'extroverted', 'friendly', 'giving', 'happy', 'helpful', 'idealistic', 'independent', 'ingenious', 'intelligent', 'introverted', 'kind', 'knowledgeable', 'logical', 'loving', 'mature', 'modest', 'nervous', 'observant', 'organised', 'patient', 'powerful', 'proud', 'quiet', 'reflective', 'relaxed', 'religious', 'responsive', 'searching', 'self-assertive', 'self-conscious', 'sensible', 'sentimental', 'shy', 'silly', 'spontaneous', 'sympathetic', 'tense', 'trustworthy', 'warm', 'wise', 'witt'];

for (var i in conf) {
  val = conf[i];
  console.log("inserting: " + val);
  collection.insert({
        "skillTitle" : val
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            console.log("There was a problem adding the information to the database.");
        }
    });

}

res.redirect("skills");
*/


});

module.exports = router;
