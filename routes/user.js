import express from "express";
import {createUser} from "../controller/users/userController.js";


const userRouter = express.Router();

userRouter.post('/register', createUser);

// auth
userRouter.use((req,res)=>{
    res.status(404).json({
        message: 'End point Not Found'
    })
})
export default userRouter;