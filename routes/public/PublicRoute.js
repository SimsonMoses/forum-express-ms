import express from "express";
import PostRoute from "./PostRoute.js";
import {authenticationHandler} from "../../middleware/authentication.js";
import router from "../forumRoute.js";


const publicRouter = express.Router();

publicRouter.use('/post',PostRoute);

export default publicRouter;