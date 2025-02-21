import express from "express";
import {commentPublicPost, getAllPublicComments} from "../../controller/public/PublicPostController.js";
import {authenticationHandler} from "../../middleware/authentication.js";

const router = express.Router();
router.use(authenticationHandler)
router.route('/').post(commentPublicPost).get(getAllPublicComments)

export default router;