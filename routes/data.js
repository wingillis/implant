var express = require('express');
var router = express.Router();

/* get request */
router.get('/test', function(req, res) {
  res.send('Test is now complete');
});

router.post('/test', function(req, res) {
  res.send('Good job posting!');
});

module.exports = router;
