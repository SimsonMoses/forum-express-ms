import {createForumPost} from "../../controller/forum/forumPostController.js";
import express from "express";


const router = express.Router();

router.use
router.route('/').post(createForumPost);

export default router;