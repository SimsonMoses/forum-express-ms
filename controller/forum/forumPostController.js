import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";
import {isUserForumMember} from "./forumMemberController.js";
import {Op} from "sequelize";

const {ForumPost} = db;

export const createForumPost = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {forumId,title,content,files}  = req.body;
    const forumMember = await isUserForumMember(forumId,userId);
    console.log(`userId: ${userId}, forumId: ${forumId}, forumMember: ${forumMember}`);
    if (!forumMember) {
        res.status(403);
        throw new Error('You are not a member of this forum');
    }

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
        message: 'Forum post created successfully',
        data: forumPost.id
    })
})

export const fetchForumPosts = expressAsyncHandler(async (req,res)=>{
    const {forumId,offset=0,limit=10,search=""} = req.query;
    if(!forumId){
        res.status(400);
        throw new Error('Forum Id must be passed');
    }
    const forumPosts = await ForumPost.findAll({
        where:{
            forumId,
            title:{
                [Op.like]: `%${search.toLowerCase()}%`,
            },
        },
        order: [
            ['createdAt', 'DESC'],
        ],
        offset: +offset,
        limit: +limit
    })

    res.status(200).json({
        message: 'Forum posts retrieved successfully',
        data: convertForumPostsResponses(forumPosts) // dto conversion needed
    })
})

const convertForumPostResponse = (forumPost)=>{
    return {
        id: forumPost.id,
        title: forumPost.title,
        content: forumPost.content,
        isPinned: forumPost.isPinned,
        files: forumPost.files,
        createdAt: forumPost.createdAt,
    }
}
const convertForumPostsResponses = (forumPosts)=>{
    return forumPosts.map(forumPost=>convertForumPostResponse(forumPost));
}