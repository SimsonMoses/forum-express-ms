import express from "express";
import {createUser, login} from "../controller/users/userController.js";

const authRoute = express.Router();

authRoute.post('/register', createUser);
authRoute.post('/login', login);

export default authRoute;