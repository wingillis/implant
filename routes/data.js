var express = require('express');
var router = express.Router();

var fs = require('fs');


/* get request */
router.get('/location', function(req, res) {
  var lat = parseFloat(req.query.lat);
  var long = parseFloat(req.query.long);
  var db = req.db;
  db.collection('geocollection').findOne({
    loc: {
      $near: {
        $geometry: {type: 'Point',
                   coordinates: [lat, long]},
        $maxDistance: 1000
      }
    }
  }, function(err, result){
    if(err) throw err;
    if (result == null) {
      res.send('Yes');
    } else {
      res.send('No');
    }
  });

});

router.post('/upload', function(req, res) {
  var vals;
  var db = req.db;
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    //console.log("Uploading: " + filename);
    var filepath = __dirname + '/../data/';
    fstream = fs.createWriteStream(filepath + 'photo.png');
    file.pipe(fstream);



    req.busboy.on('field', function (key, val, kt, vt) {
      //console.log(val);
      vals = JSON.parse(val);
      var dbInsert = {
        name: vals.name,
        loc: [vals.location.lat, vals.location.long],
        user: vals.user,
        radius: vals.radius
      };
      //console.log(vals);
      db.collection('geocollection').insert(dbInsert, function(err, result) {
        if(err) throw err;
        if (result) console.log(result);
      });
      fstream.close(
        fs.rename(filepath + 'photo.png', filepath + vals.name, function () {
          //console.log('Renamed');
        }));
        res.redirect('back');
    });

  });
  //res.send('yes');
});

router.post('/message', function(req, res) {
  res.send('Yes');
});

module.exports = router;
