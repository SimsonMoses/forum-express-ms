import express from "express";
import PostRoute from "./PostRoute.js";


const publicRouter = express.Router();

publicRouter.use('/post',PostRoute);

export default publicRouter;