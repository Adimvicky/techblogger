const Post = require("../models/Post");
const User = require("../models/User");
const util = require("../util");

module.exports = {
    newPost : async function(req,res,next){
        let fieldsValid = util.validateFields(req,res,['title','subtitle','body']);
        if(fieldsValid){
            let { title, subtitle, body } = req.body;
            Post.create({
                title,
                subtitle,
                body : body.trim(),
                owner : req.userId
            })
            .then(async(post) => {
                let user = await User.findOne({_id:req.userId});
                user.posts.push(post);
                user.save();
                return res.json({success:true,message:"Post created successfully",data:post});
            })
            .catch(e => {
                return res.status(500).send({success : false, message : "An error ocurred"});
            })
        }
    },
    updatePost : async function(req,res,next){
        let { postId } = req.params;
        let { title, subtitle, body } = req.body;

        let post = await Post.findOne({_id : postId});
        if(post){
            if(post.owner == req.userId){
                Post.updateOne({_id:postId},{title,subtitle,body},(err) => {
                    if(!err){
                        res.send({success:true,message:"Post updated successfully"});
                    } else {
                        res.send({success:false,message:"An error ocurred"});
                    }
                });
            } else {
                res.send({success:false, message: "You can't update this post"});
            }
        } else{
            res.send({success:false, message : "Post not found"});
        }
    },
    deletePost : async function(req,res,next){
        let { postId } = req.params;

        let post = await Post.findOne({_id : postId});
        if(post){
            if(post.owner == req.userId){
                Post.deleteOne({_id:postId},(err) => {
                    if(!err){
                        res.send({success:true,message:"Post deleted successfully"});
                    } else {
                        res.send({success:false,message:"An error ocurred"});
                    }
                });
            } else {
                res.send({success:false, message: "You can't delete this post"});
            }
        } else{
            res.send({success:false, message : "Post not found"});
        }
    },
    getPosts : async function(req,res,next){
        let posts = await Post.find({owner : req.userId});
        if(posts){
            return res.send({success:true,message:"posts returned successfully",data:posts});
        } else {
            return res.send({success:false,message:"Could not get posts"});
        }
    }
}