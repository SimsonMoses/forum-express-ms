import {createForumPost, fetchForumPosts} from "../../controller/forum/forumPostController.js";
import express from "express";


const router = express.Router();

router.use
router.route('/').post(createForumPost).get(fetchForumPosts);

export default router;