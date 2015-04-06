var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var _ = require('underscore');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
mongoose.connect('mongodb://localhost/imooc');

var app = express();	//start view

app.set('view engine','jade');
app.set('views','./views/pages');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.listen(port);
console.log("server started on port : "+port );

//index page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			coonsole.log(err);
		}
		console.log("movies:"+movies);
		res.render('index',{title:'imooc index',movies:movies});
	})
})

//detail page
app.get('/movie/:id',function(req,res){
	var id = req.params.id;
	console.log("detail get params id="+id);
	Movie.findById(id,function(err,movie){
		if(err){console.log(err);}
		res.render('detail',{
			title:'imooc detail '+movie.title,
			movie:movie 
		});
	});
})

//admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{title:'imooc admin',
		movie:{
			doctor:'',
			country:'',
			title:'',
			poster:''
		}
		});
})
//admin update movie
app.get('/admin/update/:id',function(req,res){
	//var oid = req.body.movie._id;
	var oid = req.params.id;

	if(oid){
		Movie.findById(oid,function(err,movie){
			res.render('admin',{
				title:'imooc update movie from list',
				movie:movie
			})
		})
	}
})

//admin post movie             POST!!!
app.post('/admin/movie/new',function(req,res){
	console.log(" redirect to movie/new luyou");
	// var country = req.body.country;
	// console.log("country = " + country);

	var oid = req.body.movie._id;
	console.log("oid = " + oid);
	var movieObj = req.body.movie;
	console.log("movieObj = " + movieObj);
	var _movie;
	console.log("2");

	if(oid != 'undefined'){
		//Update
		console.log("3");
		Movie.findById(oid,function(err,movie){
			if(err){console.log(err);}
			_movie = _.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err){console.log(err);}
				res.redirect('/movie/' + movie._id);
			})
		})
		console.log("4");
	}else{
		//Add
		console.log("5");
		_movie = new Movie({
			doctor : movieObj.doctor,
			title : movieObj.title,
			country : movieObj.country,
			poster : movieObj.poster,
		})
		_movie.save(function(err,movie){
			if(err){console.log(err);}
			res.redirect('/movie/' + movie._id);
		})
		console.log("6");
	}
})


//list page
app.get('/admin/list',function(req,res,next){
	Movie.fetch(function(err,movies){
		if(err){
			coonsole.log(err);
		}
		res.render('list',{title:'imooc admin/list',movies:movies});
	})
})

//list delete 
app.delete('/admin/list',function(req,res){
	console.log("delete");
	var id = req.query.id;
	console.log("id = "+id);
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){console.log("err = " + err)}
			else{
				res.json({success:1})
			}
		})
	}
})

