var express = require('express');
var router = express.Router();
const Profile = require("../models/profile");
const Skill = require("../models/skill");


router.get('/add', function (req, res, next) {
  var target = req.query.target;
  var source = req.session.personalSecretId;

  if (target == undefined || target == source) {
    console.log("Using default user self");
    target = "yourself";
  }

  console.log("Source: [" + source + "]  Targeting: [" + target + "]");

  Skill.find().collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).exec((err, skills) => {
    if (skills) {
      console.log("Skills found");
      console.log(skills);
    } else {
      req.flash('error_msg', 'Skills not available');
    }
    res.render('profileAdd', { message: req.flash('error_msg'), skillsList: skills, title: "Skills", "target": target });
  });
});


router.get('/share', function (req, res, next) {
  var appIp = req.appIp;
  var target = req.query.target;
  var source = req.session.personalSecretId;

  if (target == undefined || target == source) {
    console.log("Using default user self");
    target = "yourself";
  }

  console.log("Source: [" + source + "]  Targeting: [" + target + "]");

  // Set our collection
  res.render('profileShare', {
    "stepDetails": "Share ",
    "target": target,
    "appIp": appIp
  });
});

router.get('/show', function (req, res, next) {
  var appIp = req.appIp;
  /*
  var fullListOfAttributes = [];
  
  var attrCollection = db.get('skills');
  attrCollection.find({},{},function(e,result){
      for (var attributeTmp in result) {
          //console.log(result[attributeTmp]["skillTitle"]);
          fullListOfAttributes.push(result[attributeTmp]["skillTitle"]);
      }
      
  });*/

  Skill.find().collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).exec((err, skills) => {
    var target = req.query.target;
    var source = req.session.personalSecretId;

    if (target == undefined) {
      console.log("Using default user self");
      target = source;
    }
    console.log("Source: [" + source + "]  Targeting: [" + target + "]");

    if (skills) {
      console.log("Skills found: " + skills.length);
      var attrMatrix = {};
      skills.forEach((skill) => {
        attrMatrix[skill] = [];
      });

      Profile.find({ target: target }).collation({ locale: 'en', strength: 2 }).sort({ name: 1 }).exec((err, profiles) => {
        if (profiles) {
          console.log('Profiles found:' + profiles.length);

          var modifiedResult = [];

          /*
          for (tmp in fullListOfAttributes) {
            //console.log("\tInitializing array for " + tmp);
            attrMatrix[fullListOfAttributes[tmp]] =[]
          }*/

          for (var name in profiles) {
            attributes = profiles[name].attributes;
            attrSource = profiles[name].source;
            for (var attrName in attributes) {
              //console.log(attrName + "++++++++++++++++++" + attrMatrix[attrName]);
              if (attrMatrix[attrName] != undefined && attrMatrix[attrName].indexOf(attrSource) == -1) {
                attrMatrix[attrName].push(attrSource);
              }
            }
            //console.log("Unique? ->" + attrMatrix + "<-" + attrMatrix.length + "------end");
            // 0: node to me and others
            //          modifiedResult.push({id: 0, name: result[name].source, r: 50});
          }

          var maxSize = 60;
          var minSize = 30;
          for (var i in attrMatrix) {
            //console.log("----------------Evaluating: " + i + "   " + attrMatrix[i] + "  " + attrMatrix[i].indexOf(source))
            if (attrMatrix[i].indexOf(source) != -1 && attrMatrix[i].length == 1) {
              // conocido solo por mi
              //console.log("==> Known by me => " + i);
              modifiedResult.push({ id: 0, name: i, r: minSize });
            } else if (attrMatrix[i].indexOf(source) != -1 && attrMatrix[i].length >= 2) {
              // conocido por mi y por alguien mas
              //console.log("==> Known by me and others=> " + i);
              modifiedResult.push({ id: 2, name: i, r: minSize });
            } else if (attrMatrix[i].indexOf(source) == -1 && attrMatrix[i].length >= 1) {
              // conocido por alguien mas y no por mi
              //console.log("==> Uknown by me and uknown others => " + i);
              modifiedResult.push({ id: 1, name: i, r: minSize });
            } else if (attrMatrix[i].indexOf(source) == -1 && attrMatrix[i].length == 0) {
              // desconocido
              //console.log("==> Uknown by me and known by others => " + i);
              modifiedResult.push({ id: 3, name: i, r: 25 });
            }
          }
          //console.log("modifiedResult:" + modifiedResult);
          res.render('profileShow', {
            "attributes": modifiedResult,
            "stepDetails": "This view will be updated once other people starts submitting their view on you.",
            "target": target,
            "appIp": appIp
          });
        } else {
          req.flash('error_msg', 'Target profile not found');
          res.render('profileError', {
            "error": err
          });

          // res.render('profileNoData', {
          //   "stepTitle": "No data at the moment.",
          //   "stepDetails": "This view will be updated once other people starts submitting their view on you.",
          //   "target": target
          // });
        }
      });

    } else {
      req.flash('error_msg', 'Skills not available');
      res.render('attributesList', { message: req.flash('error_msg'), skillsList: skills, title: "Skills" });
    }
  });


});

router.post('/save', function (req, res, next) {
  var target = req.query.target;
  var source = req.session.personalSecretId;
  if (target == undefined || target == "yourself") {
    console.log("Using default user" + source);
    target = source;
  }

  //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;


  console.log("Source: [" + source + "]  Targeting: [" + target + "]" + " ip ===> ");

  // console.log(req.body);
  let personalCharacteristics = [];
  let p = req.body;
  for (var key in p) {
    console.log(key + " -> " + p[key]);
    personalCharacteristics.push(key);
  }




  const moreAttributesToProfile = new Profile({
    "source": source,
    "target": target,
    "attributes": personalCharacteristics,
    "ipAddress": "27.0.0.1"
  });

  

  moreAttributesToProfile.save()
    .then((value) => {
      console.log("Profile attributes created");
      console.log(value);
      req.flash('success_msg', 'You have now registered a team!');
      //res.redirect('/profiles/show');
      res.redirect('/');

      // res.render('profileNoData', {
      //   "stepTitle": "Thanks so much for your feedback",
      //   "stepDetails": "The information has been submitted and processed.",
      //   "target": target
      // });
    })
    .catch(value => {
      console.log(value);
      res.send("There was a problem adding the information to the database.");
    });



});



module.exports = router;
