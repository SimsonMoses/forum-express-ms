import expressAsyncHandler from "express-async-handler";

import db from "../../models/index.js";
import {Op} from "sequelize";


const {PostLike, ForumPost, sequelize} = db;

export const like = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {postId,commentId, like, categoryType} = req.body;
    const post = await ForumPost.findOne({
        where: {
            id: postId
        }
    })
    console.log('categoryType',categoryType);
    console.log(categoryType !== 'POST' && categoryType !== 'COMMENT');
    if(categoryType !== 'POST' && categoryType !== 'COMMENT'){
        res.status(400);
        throw new Error('Invalid category type');
    }
    const categoryBasedIdType = categoryType === 'POST' ? {postId:postId} : {commentId:commentId};
    if (!post) {
        res.status(400);
        throw new Error('Post not found');
    }

    if (like === false) {
        const likeData = await PostLike.destroy({
            where: {
                ...categoryBasedIdType,
                userId,
                categoryType: categoryType
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
    const [created] = await PostLike.findOrCreate({
        where: {
            ...categoryBasedIdType,
            userId,
            categoryType: categoryType
        },
        defaults: {
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

// const createLike = async (req,res)=>{
//
// }

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
    // TODO: need to implement for comments
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