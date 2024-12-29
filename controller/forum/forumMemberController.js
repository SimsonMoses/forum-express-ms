import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";
import {Op} from "sequelize";


const {User, sequelize, Forum, ForumMember} = db;

// TODO: force add the member
export const addForumMember = expressAsyncHandler(async (req, res) => {
    const {forumId, userId, role} = req.body;
    try {
        if (!forumId || !userId || !role) {
            res.status(400);
            throw new Error('Forum Id, User Id and Role must be passed');
        }
        const forumMember = await ForumMember.create({forumId, userId, role, status: 'active'});
        if (!forumMember) {
            res.status(400);
            throw new Error('Failed to add forum member');
        }
        res.status(200).json({
            message: 'Forum member added successfully'
        })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            throw new Error('already a member');
        }
    }
})

// TODO: force remove the member
export const removeMember = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {memberId, forumId} = req.body;
    const forum = await Forum.findOne({
        id: forumId
    })
    if (!forum) {
        throw new Error('Forum Not Found');
    }
    const forumMembers = await ForumMember.findAll({
        where: {
            userId: {
                [Op.in]: [userId, memberId]
            },
            forumId: forumId
        }
    })

    if(forumMembers.filter(member=>member.userId === userId && member.role === 'admin')<1){
        return res.status(403).json({
            message: 'You are not authorized to remove member',
            data: forumMembers.filter(member=>member.userId === userId)
        })
    }
    if(forumMembers.filter(member=> member.userId === memberId && member.role === 'admin').length>0){
        return res.status(403).json({
            message: 'You are not authorized to remove admin',
            data: forumMembers.filter(member=> member.userId === memberId)
        })
    }
    const deletedCount = await ForumMember.destroy({
        where:{
            userId: memberId,
            forumId: forumId
        }
    })
    if (deletedCount === 0) {
        res.status(400)
        throw new Error('No record found to delete');
    }
    return res.status(200).json({
        message: 'user deleted successfully',
        data: deletedCount!==0
    })
})

// TODO: force update the member ROLE

// TODO: request user to join forum

// TODO: ACTION(approved | reject) user to join forumd

// TODO: get all forum members by forum id

// TODO: get all member to invite to forum (exclude the (current | requested | invited) members)

// TODO: status to request | invite member

