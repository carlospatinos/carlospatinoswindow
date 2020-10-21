var express = require('express');
var router = express.Router();

var cTitle = "Carlos window"

/* GET home page. */
router.get('/', function(req, res, next) {
    sess = req.session;
    console.log(sess);
    //Session set when user Request our app via URL
    res.render('index', { title: cTitle });
  
});


router.get('/logout', function(req, res, next) {
    sess = req.session;
    sess.personalSecretId = undefined;
    req.session.reset();
    req.session.destroy();

    console.log("logout" + req.session);

    res.redirect('/login');  
});

router.get('/login', function(req, res, next) {
    console.log("login ===>" + req.query.urlToGo);
    res.render('login', { title: cTitle, urlToGo: req.query.urlToGo });
});

router.post('/login', function(req, res, next) {
    sess = req.session;
    var personalSecretId = req.body.personalSecretId;
    sess.personalSecretId = personalSecretId;
    //Session set when user Request our app via URL
    var urlToGo = req.query.urlToGo;
    if(urlToGo != undefined && urlToGo != "undefined") {
      console.log("Going to " + urlToGo);
      res.redirect(urlToGo);
    } else {
      res.redirect('/');
    }
    
  
});


module.exports = router;
