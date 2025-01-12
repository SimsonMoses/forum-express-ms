import expressAsyncHandler from "express-async-handler";

import db from "../../models/index.js";


const {ForumPost, PostComment} = db;

// TODO: comment rate limiter to prevent spamming
export const commentPost = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {postId, description} = req.body;
    if (!postId || !description) {
        return res.status(400).json({
            message: 'Post Id and Description must be passed'
        })
    }
    const post = await ForumPost.findOne({
        where: {
            id: postId
        }
    })
    if (!post) {
        return res.status(400).json({
            message: 'Post not found'
        })
    }
    const comment = await PostComment.create({
        postId,
        userId,
        description
    })
    if (!comment) {
        return res.status(400).json({
            message: 'Failed to comment the post'
        })
    }
    return res.status(200).json({
        message: 'Post commented successfully'
    })
});


export const getAllComments = expressAsyncHandler(async (req, res) => {
    const {postId, limit = '10', offset = '0'} = req.query;
    if (!postId) {
        return res.status(400).json({
            message: 'Post Id must be passed'
        })
    }
    const comments = await PostComment.findAndCountAll({
        where: {
            postId
        },
        order: [
            ['createdAt', 'DESC']
        ],
        limit: +limit,
        offset: +offset
    })
    return res.status(200).json({
        message: 'Comments fetched successfully',
        total: comments.count,
        data: convertCommentResponses(comments.rows)
    })
})

const convertCommentResponse = (comment) => {
    return {
        id: comment.id,
        description: comment.description,
        userId: comment.userId,
        postId: comment.postId,
        createdAt: comment.createdAt
    }
}

const convertCommentResponses = (comments) => {
    return comments.map(comment => convertCommentResponse(comment));
}

// TODO: update comment
export const updatePostComment = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {commentId, description} = req.body;
    if (!commentId || !description) {
        return res.status(400).json({
            message: 'Comment Id and Description must be passed'
        })
    }
    const comment = await PostComment.update({description},
        {
            where: {
                id: commentId,
                userId
            }
        })
    if(comment[0] === 0){
        return res.status(403).json({
            message: 'You are not authorized to update the comment'
        })
    }
    if(!comment){
        return res.status(400).json({
            message: 'Failed to update the comment'
        })
    }
    return res.status(200).json({
        message: 'Comment updated successfully'
    })
})

// TODO: delete comment
export const deletePostComment = expressAsyncHandler(async (req,res)=>{
    const {userId} = req.user;
    const {commentId} = req.query;
    if(!commentId){
        throw new Error('Comment Id must be passed')
    }
    const comment = await PostComment.destroy({
        where:{
            id:commentId,
            userId,
        }
    })
    if(!comment){
        throw new Error('Failed to delete the comment')
    }
    return res.status(200).json({
        message: 'Comment deleted successfully'
    })
})