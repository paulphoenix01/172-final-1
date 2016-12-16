var router = require('express').Router();
var category = require('./categoryModel');


router.param('category_id', function(req, res, next){
	category.findOne({'_id': req.params.category_id},
		function(err,theCate){
			if(theCate){	// Found post
				req.category_id = req.params.category_id;
				req.theCate = theCate;
				next();
			}else{		// Post not found
				req.category_id = req.params.category_id;
				next();
			}
		})
});

router.route('/')
	.get(function(req,res){
		getCategories(res);
	})
	.post(function(req,res){
		category.create({
			name: req.body.name,
		},function(err, theCate){
			if(err) res.send(err);
			category.save(function(err){
				if(err) return res.send();
				res.json({message:"New Category Created"});
			});
		})
	});


router.route('/:category_id')
	.get(function(req,res){
		res.json(req.theCate||{});
	})
	.delete(function(req,res){
		post.remove({'_id': req.category_id}, function(err){
				if(err) throw err;
		});
	})
	.put(function(req,res){
		post.findOne({'_id':req.category_id}, function(err,theCate){
			if(err) throw err;
			theCate.name = req.body.name;
		})
	});

function getCategories(res){
	category.find(function(err,categories){
		if(err) res.send(err);
		res.json(posts|| {} );
	})
};


module.exports = router;

