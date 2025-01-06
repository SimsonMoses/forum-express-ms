import {
    createForumPost,
    deleteForumPost,
    fetchForumPosts,
    updateForumPost
} from "../../controller/forum/forumPostController.js";
import express from "express";
import {getPostLikeCount, like} from "../../controller/forum/postLikeController.js";


const router = express.Router();

router.use
router.route('/').post(createForumPost).get(fetchForumPosts).put(updateForumPost).delete(deleteForumPost);
router.route('/like').post(like).get(getPostLikeCount)

export default router;