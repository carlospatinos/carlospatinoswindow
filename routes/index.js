var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    sess = req.session;
    //Session set when user Request our app via URL
    if(sess.signum) {
    /*
    * This line check Session existence.
    * If it existed will do some action.
    */
        //res.redirect('/admin');
        res.render('index', { title: 'Welcome' });
    } else {
        console.log("Uknown user, please login")
        res.render('login', { title: 'Welcome' });
    }
  
});


router.get('/logout', function(req, res, next) {
    sess = req.session;
    sess.signum = undefined;
    res.redirect('/');  
});

router.post('/login', function(req, res, next) {
    sess = req.session;
    var signum = req.body.signum;
    sess.signum = signum;
    //Session set when user Request our app via URL
    res.redirect('/');
  
});


module.exports = router;
