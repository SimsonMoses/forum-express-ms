import express from "express";
import {createPost, getAllPosts, updatePost} from "../../controller/public/PostController.js";
import {authenticationHandler} from "../../middleware/authentication.js";

const router = express.Router();

router.use(authenticationHandler)
router.route("/").post(createPost).get(getAllPosts).put(updatePost);

export default router;