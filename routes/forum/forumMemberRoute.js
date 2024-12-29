import express from "express";
import { addForumMember, removeMember } from "../../controller/forum/forumMemberController.js";

const router = express.Router();

router.route('/').post(addForumMember).delete(removeMember)

export default router;