import {
    createForumPost,
    deleteForumPost,
    fetchForumPosts,
    updateForumPost
} from "../../controller/forum/forumPostController.js";
import express from "express";
import {getPostLikeCount, like} from "../../controller/forum/postLikeController.js";
import {
    commentPost,
    deletePostComment,
    getAllComments,
    updatePostComment
} from "../../controller/forum/postCommentController.js";


const router = express.Router();

router.use
router.route('/').post(createForumPost).get(fetchForumPosts).put(updateForumPost).delete(deleteForumPost);
router.route('/like').post(like).get(getPostLikeCount);
router.route('/comment').post(commentPost).get(getAllComments).put(updatePostComment).delete(deletePostComment);

export default router;