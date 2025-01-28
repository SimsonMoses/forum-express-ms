import express from "express";
import {createUser, fetchUserById, fetchUsers, login, me, updateProfile} from "../controller/users/userController.js";
import { authenticationHandler } from "../middleware/authentication.js";


const userRouter = express.Router();

userRouter.post('/register', createUser);
userRouter.post('/login', login);
// userRouter.use(authenticationHandler)
// userRouter.get('/me', me);
// userRouter.get('/profile/:id',fetchUserById);
// userRouter.get('/all-profile',fetchUsers);
// userRouter.put('/profile/update',updateProfile);
// auth
userRouter.use((req,res)=>{
    res.status(404).json({
        message: 'End point Not Found'
    })
})
export default userRouter;