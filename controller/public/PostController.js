import expressAsyncHandler from "express-async-handler";

import db from "../../models/index.js";

const {Post} = db;


export const createPost = expressAsyncHandler(async (req, res) => {

    const {title, content, files} = req.body;
    if (!title || !content) {
        res.status(400);
        throw new Error('Title and Content must be passed');
    }
    const {userId} = req.user;
    console.log(`api_public_post; userId: ${userId}, title: ${title}, content: ${content}, files: ${files}`);
    const post = await Post.create({
        userId,
        title,
        content
    })
    if (!post) {
        res.status(400);
        throw new Error('Failed to create post');
    }
    // TODO: NEED TO IMPLEMENT KAFKA PRODUCER HERE
    return res.status(200).json({
        message: 'Post created successfully',
        data: post.id
    })
})

export const getAllPosts = expressAsyncHandler(async (req, res) => {
    const posts = await Post.findAll({
        order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({
        message: 'All Posts',
        data: posts
    })
});

export const updatePost = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {postId, title, content, files} = req.body;
    if (!postId) {
        res.status(400);
        throw new Error('PostId must be passed');
    }
    var post = await Post.findOne({
        where: {
            id: postId,
            userId
        }
    });
    if (!post) {
        res.status(400);
        throw new Error('Post not found');
    }
    post.title = title;
    post.content = content;
    post.files = files;
    post = await post.save();
    return res.status(200).json({
        message: 'Post updated successfully',
        data: post.id,
        status: "Success"
    })

});

export const deletePost = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {postId} = req.query;
    if (!postId) {
        res.status(400);
        throw new Error('PostId must be passed');
    }
    const post = await Post.findOne({
        where: {
            id: postId,
            userId
        }
    });
    if (!post) {
        res.status(400);
        throw new Error('Post not found');
    }
    await post.destroy();
    return res.status(200).json({
        message: 'Post deleted successfully',
        data: post.id
    })
})