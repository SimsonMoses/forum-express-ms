import express from "express";
import {
    actionToJoinForum,
    addForumMember,
    getAllForumMembers, getAllMemberToInvite, getJoinedForums,
    removeMember, requestToJoinForum,
    updateMemberRole
} from "../../controller/forum/forumMemberController.js";

const router = express.Router();

router.route('/').post(addForumMember).delete(removeMember).put(updateMemberRole);
router.route('/get-all').get(getAllForumMembers);
router.route('/request').post(requestToJoinForum).put(actionToJoinForum);
router.route('/invite').get(getAllMemberToInvite);
router.route('/joined').get(getJoinedForums);

export default router;