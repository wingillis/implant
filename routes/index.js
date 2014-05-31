var express = require('express');
var uagent = require('useragent');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var agent = uagent.parse(req.headers['user-agent']);
  //console.log(agent.os);
  //console.log(agent.device);
  if ('Android' == agent.os.family || 'iOS' == agent.os.family) {
    if ('iPad' == agent.device.family) {
      res.render('large');
    } else {
      res.render('index');
    }
  } else {
    res.render('index');
  }
});

module.exports = router;
