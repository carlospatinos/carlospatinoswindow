var express = require('express');
var router = express.Router();


router.get('/add', function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;

    var target = req.query.target;
    var source = req.session.signum;

    if (target == undefined || target == source) {
        console.log("Using default user self");
        target = "yourself";
    } 
    
    console.log("Source: [" + source +  "]  Targeting: [" + target + "]");

    // Set our collection
    var collection = db.get('skills');
    collection.find({},{},function(e,docs){
        res.render('profileAdd', {
            "skillsList" : docs,
            "stepDetails": "Please select between 3 and 5 values that describe ",
            "target" : target 
        });
    });
});


router.get('/show', function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;

    var target = req.query.target;
    var source = req.session.signum;
    if (target == undefined) {
        console.log("Using default user self");
        target = "yourself";
    } 
    
    console.log("Source: [" + source +  "]  Targeting: [" + target + "]");

    // Set our collection
    var collection = db.get('attributesPerPersonByDate');
    /*
    collection.find({},{},function(e,docs){
        res.render('profileShow', {
            "attributes" : docs,
            "stepDetails": "This view will be updated once other people starts submitting their view on you.",
            "target" : target 
        });
    });*/

    collection.find({target: 'ecapati'},{},function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        //console.log('Found:', result);

        var modifiedResult = [];
        for (var name in result) {
          console.log(result[name].source);
          console.log(result[name].attributes);
          console.log(result[name].target);
          console.log(result[name].ipAddress);
        }


        res.render('profileShow', {
            "attributes" : modifiedResult,
            "stepDetails": "This view will be updated once other people starts submitting their view on you.",
            "target" : target 
        });

      } else {
        console.log('No document(s) found with defined "find" criteria!');
      }
      //Close connection
      // db.close();
    });

});

router.post('/save', function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;

    var target = req.query.target;
    var source = req.session.signum;
    if (target == undefined || target == "yourself") {
        console.log("Using default user" + source);
        target = source;
    } 

    //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var ipAddress = req.ip;
    
    console.log("Source: [" + source +  "]  Targeting: [" + target + "]" + " ip ===> " + ipAddress);

    // Set our collection
    var collection = db.get('attributesPerPersonByDate');

    // Submit to the DB
    collection.insert({
        "source" : source,
        "target" : target,
        "attributes" : req.body,
        "ipAddress" : ipAddress
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            if (source == target) {
                res.redirect('/profiles/show');
            } else {
                res.send("Thanks so much for your feedback");
            }
        }
    });

});



module.exports = router;
