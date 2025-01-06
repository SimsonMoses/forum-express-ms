import expressAsyncHandler from "express-async-handler";

import db from "../../models/index.js";
import {Op} from "sequelize";


const {PostLike, ForumPost, sequelize} = db;

export const like = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {postId, like} = req.body;
    const post = await ForumPost.findOne({
        where: {
            id: postId
        }
    })
    if (!post) {
        res.status(400);
        throw new Error('Post not found');
    }
    if (like === false) {
        const likeData = await PostLike.destroy({
            where: {
                postId,
                userId
            }
        })
        if (!likeData) {
            res.status(400);
            throw new Error('Failed to unlike the post');
        }
        return res.status(200).json({
            message: 'Post unliked successfully'
        })
    }
    const [likeData, created] = await PostLike.findOrCreate({
        where: {
            postId,
            userId
        },
        defaults: {
            postId,
            userId
        }
    });
    if (!created) {
        res.status(400);
        throw new Error('You have already liked the post');
    }
    return res.status(200).json({
        message: 'Post liked successfully',
        data: 'success'
    })
})

/** Get post likes count for multiple posts
 * @param postIds
 * @returns {Promise<Model[]>}
 */
export const getPostsLikesCountByIds = async (postIds)=>{
    const postLikes = await PostLike.findAll({
        attributes:[
            ['postId','postId'],
            [sequelize.fn('COUNT',sequelize.col('postId')),'count'],
        ],
        where:{
            postId:{
                [Op.in]:postIds
            }
        },
        group:['postId']
    })
    return postLikes;
}

// testing
export const getPostLikeCount = expressAsyncHandler(async (req,res)=>{
    const {postIds} = req.body;
    const postLikes = await getPostsLikesCountByIds(postIds);
    return res.status(200).json({
        message: 'Post likes count',
        data: postLikes
    })
})