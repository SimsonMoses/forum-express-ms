import express from "express";
import {createUser, fetchUserById, fetchUsers, login, me, updateProfile} from "../controller/users/userController.js";
import { authenticationHandler } from "../middleware/authentication.js";


const userRouter = express.Router();

userRouter.post('/register', createUser);
userRouter.post('/login', login);
const protectedRoutes = express.Router();
protectedRoutes.use(authenticationHandler)
protectedRoutes.get('/me', me);
protectedRoutes.get('/profile/:id',fetchUserById);
protectedRoutes.get('/all-profile',fetchUsers);
protectedRoutes.put('/profile/update',updateProfile);
userRouter.use(protectedRoutes)
// auth
// userRouter.use((req,res)=>{
//     console.log(`End Point: ${req.originalUrl} not found`);
//     res.status(404).json({
//         message: 'End point Not Found'
//     })
// })
export default userRouter;