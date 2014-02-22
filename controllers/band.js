var ToDay = require('./today');
var today = new ToDay;
var crypto = require('crypto');


exports.profil = function(req,res){
  //search the user which has the id in the request
  db.Band.find(req.params.id)
  .success(function(band){
    if(band!=null)
      res.render('band',{
        layout:'main',
        name: band.name,
        creation: band.creation,
      });
    else
      res.send('404');
  })
  .error(function(error){
    res.send('404ERROR');
  });
};


exports.create = function(req,res){
  res.render('band-create',{
    layout:'main'
  });
};

exports.save = function(req,res){
  //create a new user to save it
  var band = db.Band.build({
    name: req.body.name,
    creation: today.now()
  });

  db.Band.find({where:{'name':band.name}})
   .success(function(bandFound){
    //if the band doesn't exist in the database
    if(bandFound==null) {
      //save the band in the database
      band.save()
        .success(function(){res.send("SUCCESS");})
        .error(function(error){res.send(error);});
     }
     else
      res.send("BAND ALREADY EXISTS !");
   });
};
