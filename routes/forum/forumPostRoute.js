import {createForumPost, fetchForumPosts, updateForumPost} from "../../controller/forum/forumPostController.js";
import express from "express";


const router = express.Router();

router.use
router.route('/').post(createForumPost).get(fetchForumPosts).put(updateForumPost);

export default router;