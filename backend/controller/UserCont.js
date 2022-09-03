import UserModel from "../model/userModel.js";
import bcrypt from "bcrypt";

// get user
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);
        if (user) {
            const {password, ...otherDetails} = user._doc;
            res.status(200).json(otherDetails);
        }else{
            res.status(404).json("no user exists");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}


// update user
export const updatUser = async (req, res) =>{
    const id = req.params.id;
    const {currentUserId, isAdminStatus, password} = req.body;

    if (id===currentUserId || isAdminStatus) {
        
        try {
            
            if(password){
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(password, salt)
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("Access denied you can only update your own profile");
    }

}

//delete user

export const deletUser = async (req, res) =>{
    const id = req.params.id;

    const {currentUserId, isAdminStatus} = req.body;

    if(currentUserId === id || isAdminStatus){
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("user deleted successfuly");
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("Access denied you can only delate your own profile");
    }

}

// follow

export const followUser = async (req, res) =>{
    const id = req.params.id;
    const {currentUserId} = req.body;
    if(id === currentUserId){
        res.status(403).json("Action not allowed")

    }
    else{
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)
            if(!followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$push: {followers: currentUserId}})
                await followingUser.updateOne({$push: {following: id}})
                res.status(200).json("user followed")
            }
            else{
                res.status(200).json("user is already followed by you")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }

}

// unfollow

export const unFollowUser = async (req, res) =>{
    const id = req.params.id;
    const {currentUserId} = req.body;
    if(id === currentUserId){
        res.status(403).json("Action not allowed")

    }
    else{
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)
            if(followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$pull: {followers: currentUserId}})
                await followingUser.updateOne({$pull: {following: id}})
                res.status(200).json("user unfollowed")
            }
            else{
                res.status(200).json("user is already not followed by you")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }

}