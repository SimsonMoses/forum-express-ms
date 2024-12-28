import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";


const {User, sequelize, Forum, ForumMember} = db;

// TODO: force add the member
export const addForumMember = expressAsyncHandler( async(req, res)=>{
    const {forumId, userId, role} = req.body;
    try{
        if(!forumId || !userId || !role){
            res.status(400);
            throw new Error('Forum Id, User Id and Role must be passed');
        }
        const forumMember = await ForumMember.create({forumId, userId, role, status: 'active'});
        if(!forumMember){
            res.status(400);
            throw new Error('Failed to add forum member');
        }
        res.status(200).json({
            message: 'Forum member added successfully'
        })
    }catch(err){
        if(err.name==='SequelizeUniqueConstraintError'){
            throw new Error('already a member');
        }
    }
})

// TODO: force remove the member

// TODO: force update the member ROLE

// TODO: request user to join forum

// TODO: ACTION(approved | reject) user to join forum

// TODO: get all forum members by forum id

// TODO: get all member to invite to forum (exclude the (current | requested | invited) members)

// TODO: status to request | invite member

