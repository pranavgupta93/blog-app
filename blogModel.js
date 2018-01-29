var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var blogSchema=new Schema({
	title:{type:String,default:'',required:true},
	subTitle:{type:String,default:''},
	blogBody:{type:String,default:''},
	tags:[{type:String}],
	createdAt:{type:Date},
	updatedAt:{type:Date},
	authorInfo:{authorName:{type:String},authorEmail:{type:String}}
});

mongoose.model('blogdata',blogSchema);