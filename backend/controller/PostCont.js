import PostModel from "../model/postModel.js";

import mongoose from "mongoose";
import UserModel from "../model/userModel.js";


//create

export const createPost = async (req, res) =>{
    const newPost = new PostModel(req.body);

    try {
        await newPost.save()
        res.status(200).json("post created")
    } catch (error) {
        res.status(500).json(error)
    }
}

// get a post

export const getPost = async (req, res) =>{
    const id = req.params.id;

    try {
        const post = await PostModel.findById(id);
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}

//update post
export const updatPost = async (req, res) =>{
    const postId = req.params.id
    const {userId} = req.body;

    try {
        const post =await PostModel.findById(postId)
        if(post.userId === userId){
            await post.updateOne( { $set: req.body } )
            res.status(200).json("post is updated")
        }
        else{
            res.status(403).json("action forbitten")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// delete post

export const deletPost = async (req, res) =>{
    const id = req.params.id;
    const {userId} = req.body

    try {
        const post = await PostModel.findById(id)
        if(post.userId === userId){
            await post.deleteOne()
            res.status(200).json("post is delated successfully")
        }
        else{
            res.status(403).json("action forbitten")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


//like post

export const likePost = async (req, res) =>{
    const id = req.params.id
    const {userId} = req.body

    try {
        const post = await PostModel.findById(id)

        if(!post.likes.includes(userId)){
            await post.updateOne({$push: {likes: userId}})
            res.status(200).json("post liked")
        }
        else{
            await post.updateOne({$pull: {likes: userId}})
            res.status(200).json("post unliked") 
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


//timeline post

export const getTimeLinePost = async (req, res) =>{
    const userId = req.params.id

    try {
        const currentUserPost = await PostModel.find({userId: userId})
        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts"
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ])
        res.status(200).json(currentUserPost.concat(...followingPosts[0].followingPosts))
        .sort( (a,b)=>{
            return b.createdAt - a.createdAt;
        });
    } catch (error) {
        res.status(500).json(error)
    }
}