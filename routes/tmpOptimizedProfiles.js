var express = require('express');
var router = express.Router();


router.get('/add', function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;

    var target = req.query.target;
    var source = req.session.personalSecretId;

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

    var attrMatrix = {};

    var attrCollection = db.get('skills');
    attrCollection.find({},{},function(e,result){
        for (var attributeTmp in result) {
            //console.log(result[attributeTmp]["skillTitle"]);
            attrMatrix[result[attributeTmp]["skillTitle"]]=[];
        }
        
    });

    var target = req.query.target;
    var source = req.session.personalSecretId;
    if (target == undefined) {
        console.log("Using default user self");
        target = source;
    } 
    
    console.log("Source: [" + source +  "]  Targeting: [" + target + "]");

    // Set our collection
    var collection = db.get('attributesPerPersonByDate');


    //collection.find({target: 'carlos'},{},function (err, result) {
      collection.find({target: target},{},function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        //console.log('Found:', result);

        var modifiedResult = [];
        

        for (var name in result) {

          attributes = result[name].attributes;
          attrSource = result[name].source;
          
          for (var attrName in attributes) {

            //console.log(attrName + "++++++++++++++++++" + attrMatrix[attrName]);
            if(attrMatrix[attrName].indexOf(attrSource)==-1){
              attrMatrix[attrName].push(attrSource);
            }
          }
          //console.log("Unique? ->" + attrMatrix + "<-" + attrMatrix.length + "------end");
          
          // 0: node to me and others
//          modifiedResult.push({id: 0, name: result[name].source, r: 50});
        }

        var maxSize = 60;
        var minSize = 30;
        for(var i in attrMatrix) {
          console.log("----------------Evaluating: " + i + "   " + attrMatrix[i] + "  " + attrMatrix[i].indexOf(source))
          if (attrMatrix[i].indexOf(source) != -1 && attrMatrix[i].length == 1) {
            // conocido solo por mi
            console.log("==> Known by me => " + i);
            modifiedResult.push({id: 0, name: i, r: minSize});
          } else if (attrMatrix[i].indexOf(source) != -1 && attrMatrix[i].length >= 2) {
            // conocido por mi y por alguien mas
            console.log("==> Known by me and others=> " + i);
            modifiedResult.push({id: 2, name: i, r: minSize});
          } else if (attrMatrix[i].indexOf(source) == -1 && attrMatrix[i].length >= 1) {
            // conocido por alguien mas y no por mi
            console.log("==> Uknown by me and uknown others => " + i);
            modifiedResult.push({id: 1, name: i, r: minSize});
          } else if (attrMatrix[i].indexOf(source) == -1 && attrMatrix[i].length == 0) {
            // desconocido
            console.log("==> Uknown by me and known by others => " + i);
            modifiedResult.push({id: 3, name: i, r: minSize});
          }   
        }

        


        //console.log("modifiedResult:" + modifiedResult);

        res.render('profileShow', {
            "attributes" : modifiedResult,
            "stepDetails": "This view will be updated once other people starts submitting their view on you.",
            "target" : target 
        });

      } else {
        console.log('No document(s) found with defined "find" criteria!');
        res.render('profileNoData', {
            "stepDetails": "This view will be updated once other people starts submitting their view on you.",
            "target" : target 
        });
      }
      //Close connection
      // db.close();
    });

});

router.post('/save', function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;

    var target = req.query.target;
    var source = req.session.personalSecretId;
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
                res.render('profileNoData', {
                 "stepDetails": "Thanks so much for your feedback",
                 "target" : target 
                });
            }
        }
    });

});



module.exports = router;
