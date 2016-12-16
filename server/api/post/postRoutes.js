var router = require('express').Router();
var post = require('./postModel');


router.param('post_id', function(req, res, next){
	post.findOne({'_id': req.params.post_id},
		function(err,thePost){
			if(thePost){	// Found post
				req.post_id = req.params.post_id;
				req.thePost = thePost;
				next();
			}else{		// Post not found
				req.post_id = req.params.post_id;
				next();
			}
		})
});

router.route('/')
	.get(function(req,res){
		getPosts(res);
	})
	.post(function(req,res){
		post.create({
			title: req.body.title,
			text: req.body.text,
			author: req.body.author,
			categories: req.body.categories
		},function(err, thePost){
			if(err) res.send(err);
			post.save(function(err){
				if(err) return res.send();
				res.json({message:"New Post Created"});
			});
		})
	});


router.route('/:post_id')
	.get(function(req,res){
		res.json(req.thePost||{});
	})
	.delete(function(req,res){
		post.remove({'_id': req.post_id}, function(err){
				if(err) throw err;
		});
	})
	.put(function(req,res){
		post.findOne({'_id':req.post_id}, function(err,thePost){
			if(err) throw err;
			thePost.title = req.body.title;
			thePost.text = req.body.text;
			thePost.author = req.body.author;
			thePost.categories = req.body.categories;
		})
	});

function getPosts(res){
	post.find(function(err,posts){
		if(err) res.send(err);
		res.json(posts|| {} );
	})
};



module.exports = router;
