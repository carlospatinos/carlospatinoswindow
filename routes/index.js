var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post('/choosewords', function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var signum = req.body.signum;

    console.log('holaaaaa');
    // Set our collection
    var collection = db.get('skills');
    collection.find({},{},function(e,docs){
        res.render('choosewords', {
            "skillsList" : docs,
            "signum" : signum
        });
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
    var skillType = req.body.skillType;

    // Set our collection
    var collection = db.get('skills');

    // Submit to the DB
    /*
    collection.insert({
        "skillTitle" : skillTitle,
        "skillType" : skillType
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
*/

var conf = [ 'a', 'b', 'c'];

for (var i in conf) {
  val = conf[i];
  console.log(val.path);
}




});

module.exports = router;
