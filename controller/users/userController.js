import expressAsyncHandler from 'express-async-handler';
import db from '../../models/index.js';

const {User} = db;
export const createUser = expressAsyncHandler(async (req,res)=>{
    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password
    })
    return res.status(201).json({
        message: 'User Created',
        id:user.id
    })
})