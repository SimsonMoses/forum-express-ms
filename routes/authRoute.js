import express from "express";
import {createUser, login} from "../controller/users/userController.js";

const authRoute = express.Router();

authRoute.post('/register', createUser);
authRoute.post('/login', login);

authRoute.route('/').get((req, res) => {
    res.status(200).json({
        message: 'Welcome to Auth Route'
    })
})

export default authRoute;