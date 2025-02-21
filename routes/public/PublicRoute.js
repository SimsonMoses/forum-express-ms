import express from "express";
import PostRoute from "./PostRoute.js";
import PostCommentRoute from "./postCommentRoute.js";


const publicRouter = express.Router();

publicRouter.use('/post/comment',PostCommentRoute);
publicRouter.use('/post',PostRoute);

export default publicRouter;