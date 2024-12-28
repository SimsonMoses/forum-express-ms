import express from "express";
import { addForumMember } from "../../controller/forum/forumMemberController.js";

const router = express.Router();

router.route('/').post(addForumMember);

export default router;