import express from 'express'
import {
    createForum,
    fetchAllForum,
    fetchAllOwnedForum,
    fetchForumByCategory, fetchForumById, updateForum
} from '../controller/forum/forumController.js';
import { authenticationHandler } from '../middleware/authentication.js';
import forumMemberRouter from "./forum/forumMemberRoute.js";
import forumPostRoute from "./forum/forumPostRoute.js";

const router = express.Router();

router.use(authenticationHandler)
router.use('/manage/member', forumMemberRouter);
router.use('/post', forumPostRoute);
router.route('/').post(createForum).get(fetchAllForum);
router.route('/my').get(fetchAllOwnedForum);
router.route('/category').get(fetchForumByCategory);
router.route('/:id').get(fetchForumById).put(updateForum);

router.use((req,res)=>{
    res.status(404).json({
        message: 'End point Not Found'
    })
})

export default router;