import express from "express";
import {createPost} from "../../controller/public/PostController.js";
import {authenticationHandler} from "../../middleware/authentication.js";

const router = express.Router();

router.use(authenticationHandler)
router.post("/", createPost);

export default router;