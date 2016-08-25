var express = require('express');
var router = express.Router();


router.get('/add', function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var signum = req.body.signum;
    req.session.signum = signum;

    // Set our collection
    var collection = db.get('skills');
    collection.find({},{},function(e,docs){
        res.render('profileAdd', {
            "skillsList" : docs
        });
    });
});


router.get('/show', function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;
    var signum = req.query.signum;
    console.log("signum: " + signum);

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
            res.render('profileShow', {
                "attributes" : req.body
            });
        }
    });

});


module.exports = router;
