import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";
import {isForumAdmin, isUserForumAdmin, isUserForumMember} from "./forumMemberController.js";
import {Op} from "sequelize";
import {getPostsLikesCountByIds} from "./postLikeController.js";

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
    let forumPosts = await ForumPost.findAndCountAll({
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
    console.log(forumPosts.rows);
    let forumPostLikeCount = await getPostsLikesCountByIds(forumPosts.rows.map(post=>post.id));
    console.log("forumPostLikeCount:", forumPostLikeCount);
    console.log("forumPosts:", forumPosts.rows.map(post => post.id));
    let forumPostDate = forumPosts.rows.map(post=>{
        const like = forumPostLikeCount.find(like=>like.dataValues.postId === post.dataValues.id);
        return {
            ...post.dataValues,
            likeCount: like ? like.dataValues.count : 0
        }
    })
    console.log(forumPosts);

    res.status(200).json({
        message: 'Forum posts retrieved successfully',
        total: forumPosts.count,
        data: convertForumPostsResponses(forumPostDate), // dto conversion needed
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
        likeCount: forumPost.likeCount,
    }
}
const convertForumPostsResponses = (forumPosts)=>{
    return forumPosts.map(forumPost=>convertForumPostResponse(forumPost));
}

// TODO: update forum post
export const updateForumPost = expressAsyncHandler(async (req,res)=>{
    const {userId} = req.user;
    const {forumId,postId,title,content,files} = req.body;
    // check if user is a member of the forum
    const forumMember = await isForumAdmin(forumId,userId);
    const postData = await ForumPost.findOne({
        where:{
            id:postId,
            userId:userId,
        }
    })
    if (!forumMember || !postData) {
        res.status(403);
        throw new Error('You are not allow to update the forum');
    }
    let post = await ForumPost.update({id:postId,title,content,files},{
        where:{
            id:postId
        }
    })
    if(!post){
        res.status(400);
        throw new Error('Failed to update forum post');
    }
    return res.status(200).json({
        message: 'Forum posts updated successfully',
        data: convertForumPostResponse(post)
    })
})

// TODO: delete forum post
export const deleteForumPost = expressAsyncHandler(async (req,res)=>{
    const {userId} = req.user;
    const {forumId,postId} = req.body;
    const forumAdmin = await isForumAdmin(forumId,userId);
    const postData = await ForumPost.findOne({
        where:{
            id:postId
        }
    })
    if(!postData){
        return res.status(204).json({
            message: 'Forum post does not exists'
        })
    }
    if(!forumAdmin || postData.userId !== userId){
        res.status(403);
        throw new Error('You are not authorized to delete the post');
    }
    const post = await ForumPost.destroy({
        where:{
            id:postId
        }
    })
    if(!post){
        res.status(400);
        throw new Error('Failed to delete forum post');
    }
    return res.status(204);
})