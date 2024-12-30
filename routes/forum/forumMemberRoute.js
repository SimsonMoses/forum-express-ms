import express from "express";
import {
    addForumMember,
    getAllForumMembers,
    removeMember,
    updateMemberRole
} from "../../controller/forum/forumMemberController.js";

const router = express.Router();

router.route('/').post(addForumMember).delete(removeMember).put(updateMemberRole)
router.route('/get-all').get(getAllForumMembers)

export default router;