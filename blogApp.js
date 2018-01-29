var express=require('express');
var app=express();
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
var dbPath="mongodb://localhost/blogDB";
mongoose.connect(dbPath);

mongoose.connection.once('open',function(){
	console.log('Connection Open!!!');
});
var blogdata=require('./blogModel.js');
var blogModel=mongoose.model('blogdata');

//Application level middleware to check request is made using which API
app.use(function(req,res,next){
	console.log("request made using URL: "+req.originalUrl);
	next();
});
app.get('/',function(req,res){
	res.send('Welcome to the blog App');
});

//API to display all blogs
app.get('/blogs/all',function(req,res){
	blogModel.find(function(err,result){
		if(err){
			console.log('Some Error Occured');
		}
		else{
			res.send(result);
		}
	});
});

//API to create new blog
app.post('/blog/new',function(req,res){
	var newBlog=new blogModel();
	newBlog.title=req.body.title;
	newBlog.subTitle=req.body.subTitle;
	newBlog.blogBody=req.body.blogBody;
	var allTags="";
	if(req.body.tags!=undefined && req.body.tags!=null)
	{
		allTags=req.body.tags.split(',');
	}

	newBlog.tags=allTags;
	var today=Date.now();
	newBlog.createdAt=today;
	newBlog.updatedAt=today;
	var authorInfo={
		authorName:req.body.authorName,
		authorEmail:req.body.authorEmail
	};
	newBlog.authorInfo=authorInfo;
	newBlog.save(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.send(newBlog);
		}
	});
});


//API to edit a blog
app.put('/blog/:id/edit',function(req,res){
	var editBlog=req.body;
	
	var today=Date.now();
	editBlog.updatedAt=today;
	console.log(editBlog);
	blogModel.findOneAndUpdate({'_id':req.params.id},editBlog,{new:true},function(err,result){
		if(err){
			console.log(err);
		}
		else{
			res.send(result);
		}
	});
});

//API to delete a blog
app.post('/blog/:id/delete',function(request,response){
	blogModel.remove({"_id":request.params.id},function(err,result){
		if(err){
			console.log(err);
		}
		else{
			response.send(result);
		}
	});
});


//API to display single blog
app.get('/blog/:id/view',function(request,response){
	blogModel.findOne({"_id":request.params.id},function(err,result){
		if(err){
			console.log(err);
		}
		else{
			response.send(result);
		}
	});
});


//Application level middleware for handling 404 error
app.get('*',function(request,response,next){
	next("Error 404!!! Page Not Found!!!");
});
app.use(function(err,req,res,next){
	console.log("Inside error handler");
	res.send(err);
});
app.listen(3000,function(){
console.log('app running on port 3000');
});