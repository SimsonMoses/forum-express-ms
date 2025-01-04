import {
    createForumPost,
    deleteForumPost,
    fetchForumPosts,
    updateForumPost
} from "../../controller/forum/forumPostController.js";
import express from "express";


const router = express.Router();

router.use
router.route('/').post(createForumPost).get(fetchForumPosts).put(updateForumPost).delete(deleteForumPost);

export default router;