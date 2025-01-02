import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";


const {ForumPost} = db;

export const createForumPost = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {forumId,title,content,files}  = req.body;
    if(!forumId || !title || !content){
        res.status(400);
        throw new Error('Forum Id, Title and Content must be passed');
    }
    const forumPost = await ForumPost.create({forumId,userId,title,content,files});
    if(!forumPost){
        res.status(400);
        throw new Error('Failed to create forum post');
    }
    res.status(200).json({
        message: 'Forum post created successfully'
    })
})