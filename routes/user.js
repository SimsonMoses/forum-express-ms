import express from "express";
import {createUser, login, me} from "../controller/users/userController.js";
import { authenticationHandler } from "../middleware/authentication.js";


const userRouter = express.Router();

userRouter.post('/register', createUser);
userRouter.post('/login', login);
userRouter.use(authenticationHandler)
userRouter.get('/me', me);
// auth
userRouter.use((req,res)=>{
    res.status(404).json({
        message: 'End point Not Found'
    })
})
export default userRouter;