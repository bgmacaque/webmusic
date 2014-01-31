
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', 
  	{
  		layout: 'main',
  		title: 'Expresss',
  		macaque:true,
  		users: [
  		{nom:'najimi', value:3},
  		{nom:'kebab',value:4}
  		]
	});
};