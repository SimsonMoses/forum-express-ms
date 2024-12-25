import express from 'express'
import { createForum, fetchAllForum, fetchAllOwnedForum } from '../controller/forum/forumController.js';
import { authenticationHandler } from '../middleware/authentication.js';

const router = express.Router();

router.use(authenticationHandler)
router.route('/').post(createForum).get(fetchAllForum);
router.route('/my').get(fetchAllOwnedForum);

router.use((req,res)=>{
    res.status(404).json({
        message: 'End point Not Found'
    })
})

export default router;