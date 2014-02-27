exports.about = function(req, res){
  req.session.pokemon = 'bgmacaque';
  res.render('about', {
    layout: 'main'
  });
};