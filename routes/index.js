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
    sess.signum = undefined;
    req.session.reset();
    req.session.destroy();

    console.log("logout" + req.session);

    res.redirect('/login');  
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: cTitle });
});

router.post('/login', function(req, res, next) {
    sess = req.session;
    var signum = req.body.signum;
    sess.signum = signum;
    //Session set when user Request our app via URL
    res.redirect('/');
  
});


module.exports = router;
