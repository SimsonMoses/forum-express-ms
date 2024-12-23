import expressAsyncHandler from 'express-async-handler';
import db from '../../models/index.js';
import jwt from 'jsonwebtoken';

const { User } = db;

export const createUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password
    })
    return res.status(201).json({
        message: 'User Created',
        id: user.id
    })
})

// TODO: LOGIN
export const login = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        where: {
            email
        }
    })
    if (!user) {
        res.status(401)
        throw new Error('Invalid Email');
    }
    const isMatch = await User.verifyPassword(password, user.password);
    if (!isMatch) {
        res.status(401)
        throw new Error('Invalid Password');
    }
    const token = jwt.sign({
        user: {
            userId: user.id
        }
    }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.setHeader('token', `${token}`);
    return res.status(200).json({
        message: 'Login Success'
    })
})

// TOOD: ME
export const me = expressAsyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findOne({
        where: {
            id:userId
        }
    })
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }
    const userResponse = {
        userId: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
    }
    res.status(200).json({
        message: 'User Data',
        data: userResponse
    })
})

//TODO: GET PROFILE

//TODO; GET ALL USERS

// TODO: UPDATE PROFILE