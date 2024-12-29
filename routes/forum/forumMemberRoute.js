import express from "express";
import {addForumMember, removeMember, updateMemberRole} from "../../controller/forum/forumMemberController.js";

const router = express.Router();

router.route('/').post(addForumMember).delete(removeMember).put(updateMemberRole)

export default router;