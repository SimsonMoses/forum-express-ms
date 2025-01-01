import express from "express";
import {
    actionToJoinForum,
    addForumMember,
    getAllForumMembers, getAllMemberToInvite,
    removeMember, requestToJoinForum,
    updateMemberRole
} from "../../controller/forum/forumMemberController.js";

const router = express.Router();

router.route('/').post(addForumMember).delete(removeMember).put(updateMemberRole);
router.route('/get-all').get(getAllForumMembers);
router.route('/request').post(requestToJoinForum).put(actionToJoinForum);
router.route('/invite').get(getAllMemberToInvite);

export default router;