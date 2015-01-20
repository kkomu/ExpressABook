var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // If already logged in, go to contacts page
  if(req.session.username) {
    res.redirect('/contacts');
  }
  else {
    res.render('index', { title: 'Addressbook' });
  }
});

/* GET registration page */
router.get('/register', function(req, res) {
  res.render('register', {});
});

router.get('/addContact', function(req, res) {
  res.render('newcontact', {});
});


module.exports = router;
