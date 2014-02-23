var ToDay = require('./today');
var today = new ToDay;
var crypto = require('crypto');
var db = require('../models');

module.exports = function(io) {
  //create an object empty
  var routes = {};

  //fill the object routes
  routes.profil = function(req,res){
    //search the user which has the id in the request
    db.Band.find(req.params.id)
    .success(function(band){
      if(band!=null)
        band.getUsers()
        .success(function(users) {
          res.render('band',{
            layout:'main',
            users:users,
            id:band.id,
            name: band.name,
            creation: band.creation,
            description: band.description
          });
        });
      else
        res.send('404');
    })
    .error(function(error){
      res.send('404ERROR');
    });
  };
  
  routes.create = function(req,res){
    res.render('band',{
      layout:'main',
      create:true
    });
  };
  
  routes.save = function(req,res){
    //create a new user to save it
    var band = db.Band.build({
      name: req.body.name,
      creation: today.now(),
      description : req.body.description
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
  
  routes.addUser = function(req,res){
    //get the band in the databse
    db.Band.find(req.body.idBand)
    .success(function(band){
      if (band != null) {
        //get the user to add in the band
        db.User.find(req.body.idUser)
        .success(function(user){
          if (user) {
            band.addUser(user);
            res.send("SUCCESS");
          }
          else {
            res.send("ERREUR USER NON TROUVE")
          }
        })
        .error(function(error){
          res.send("ERROR BANDUSER");
        });
      } 
      else
        res.send("ERREUR BAND NON TROUVE");
    })
    .error(function(error){
        res.send("ERROR REQUEST");
    });
  };

  routes.removeUser = function(req,res) {
    db.Band.find(req.body.idBand)
    .success(function(band){
      if(band != null) {
        db.User.find(req.body.idUser)
        .success(function(user) {
          //remove the requested user
          band.removeUser(user);
        });
      }
    })
    .error(function(error){
      console.log(error);
    });
  };

  

  return routes;
};


