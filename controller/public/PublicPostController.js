import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";

const {PublicPostComment, Post} = db;

export const commentPublicPost = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {postId, description} = req.body;
    if (!postId || !description) {
        return res.status(400).json({
            message: 'Post Id and Description must be passed'
        })
    }
    const post = await Post.findOne({
        where: {
            id: postId
        }
    })
    if (!post) {
        return res.status(400).json({
            message: 'Post not found'
        })
    }

    const comment = await PublicPostComment.create({
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
})

export const getAllPublicComments = expressAsyncHandler(async (req, res) => {
    const {postId, limit = '10', offset = '0'} = req.query;
    if (!postId) {
        return res.status(400).json({
            message: 'Post Id must be passed'
        })
    }

    const comments = await PublicPostComment.findAndCountAll({
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
        data: covertCommentResponses(comments.rows)
    })
})

const convertCommentResponse = (comment) => {
    return {
        id: comment.id,
        description: comment.description,
        userId: comment.userId
    }
}

const covertCommentResponses = (comments) => {
    return comments.map(comment => convertCommentResponse(comment));
}