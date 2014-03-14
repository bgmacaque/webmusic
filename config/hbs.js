//configuration file for handlebars 
var hbs = require('express3-handlebars').create({
  helpers: {
    img: function(name,alt) { return '<img src="/images/'+name+'" alt="'+alt+'">';},
    styles: function() {
      //get directory name
      var fs = require('fs');
      var files;
      /* make the array which will be used for css files*/
      files= fs.readdirSync(process.cwd() + '/public/stylesheets');
      //make the string result
      var result='';
      result+='<link rel="stylesheet" href="/stylesheets/bootstrap.css">';
      for (var i = files.length - 1; i >= 0; i--) {
        var file = files[i];
        var tab = file.split('.');
        if (tab[tab.length-1]=='css' && tab[tab.length-2] != 'bootstrap')
          result+='<link rel="stylesheet" href="/stylesheets/'+file+'">';
      }
      return result;
    },
    css: function(name) {
      return '<link rel="stylesheet" href="/stylesheets/'+name+'.css">';
    },
    js: function(name) {
      return '<script src="/javascripts/'+name+'.js" type="text/javascript"></script>';
    },
    //specific to this application
    listing: function(hashmap) {
      var out = '';
      for(var key in hashmap) {
        out += '<p>'+key+'</p>';
        //tabs
        for(var i in hashmap[key]) {
          var tab = hashmap[key][i];
          out += '<li class="tab-list"><a href="/tab/profil/'+tab.id+'">'+tab.name+'</a></li>';
        }
      }
      return out; 
    }
  }
});


module.exports = hbs;
