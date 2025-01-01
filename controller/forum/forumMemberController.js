import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";
import {Op} from "sequelize";


const {User, sequelize, Forum, ForumMember,ForumMemberRequest} = db;

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

    if (!isUserForumAdmin(forumMembers, userId)) {
        return res.status(403).json({
            message: 'You are not authorized to remove member',
            data: forumMembers.filter(member => member.userId === userId)
        })
    }
    // only admin can remove the member
    if (isUserForumAdmin(forumMembers, memberId)) {
        return res.status(403).json({
            message: 'You are not authorized to remove admin',
            data: forumMembers.filter(member => member.userId === memberId)
        })
    }
    const deletedCount = await ForumMember.destroy({
        where: {
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
        data: deletedCount !== 0
    })
})

// TODO: force update the member ROLE
export const updateMemberRole = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {memberId, forumId, role} = req.body;
    const forum = await isForumExist(forumId);
    const forumMembers = await ForumMember.findAll({
        where: {
            userId: {
                [Op.in]: [userId, memberId]
            },
            forumId: forumId
        }
    })
    // TODO: make a reusable function to check if the user is admin
    if(!forumMembers){
        res.status(404);
        throw new Error('Forum member not found');
    }
    if(!isUserForumAdmin(forumMembers,userId)){
        return res.status(403).json({
            message: 'You are not authorized to update member',
        })
    }
    let userToUpdate = forumMembers.filter(member=>member.userId === memberId)[0];
    userToUpdate.role = role;
    userToUpdate = await ForumMember.update({role},{
        where:{
            userId: memberId,
            forumId: forumId
        }
    })
    return res.status(200).json({
        message: 'Forum member updated successfully',
        data: userToUpdate
    })

})

const isForumExist = async (forumId) => {
    const forum = await Forum.findOne({
        where: {
            id: forumId
        }
    })
    if (!forum) {
        throw new Error('Forum Not Found');
    }
    return forum;
}
const isUserForumAdmin = (forumMembers,userId)=>{
    return forumMembers.filter(member=>member.userId === userId && member.role === 'admin').length > 0;
}
// TODO: private function to check isUserForumMember
const isUserForumMember = async (forumId,userId)=>{
    const forumMember = await ForumMember.findOne({
        where:{
            userId,
            forumId
        }
    })
    return forumMember;
}

// TODO: request user to join forum
export const requestToJoinForum = expressAsyncHandler(async (req,res)=>{
    const {userId,forumId,requestType} = req.body;
    if(!userId || !forumId || !requestType){
        res.status(400);
        throw new Error('User Id, Forum Id and Request Type must be passed');
    }
    // todo: check if the user is already a member

    const forumMemberRequest = await ForumMemberRequest.findOne({
        userId,
        forumId,
    })
    if(forumMemberRequest){
        res.status(400);
        throw new Error(`${forumMemberRequest.requestType} Request already exist`);
    }
    const newRequest = await ForumMemberRequest.create({userId,forumId,requestType});
    if(!newRequest){
        res.status(400);
        throw new Error('Failed to request to join forum');
    }
    res.status(200).json({
        message: 'Request to join forum sent successfully'
    })

})

// TODO: ACTION(approved | reject) user to join forum
export const actionToJoinForum = expressAsyncHandler(async (req,res)=>{
    const {userId} = req.user;
    const {memberId,forumId,action} = req.body;
    const forum = await isForumExist(forumId);
    // TODO: Check current user forum admin
    const forumMemberRequest = await ForumMemberRequest.findOne({
        where:{
            userId: memberId,
            forumId
        }
    })
    if(!forumMemberRequest){
        res.status(404);
        throw new Error('Forum Member Request not found');
    }
    if(forumMemberRequest.status !== 'pending'){
        res.status(400);
        throw new Error('Request already processed');
    }
    if (action === 'approve'){
        const forumMember = await ForumMember.create({
            userId: memberId,
            forumId,
            role: 'member',
            status: 'active'
        })
        if(!forumMember){
            res.status(400);
            throw new Error('Failed to approve member');
        }
    }
    forumMemberRequest.status = action === 'approve' ? 'accepted' : 'rejected';
    await ForumMemberRequest.update({status: forumMemberRequest.status},{
        where:{
            userId: memberId,
            forumId
        }
    })
    return res.status(200).json({
        message: 'Request processed successfully',
        data: forumMemberRequest
    })
})

// TODO: get all forum members by forum id
export const getAllForumMembers = expressAsyncHandler(async (req,res)=>{
    const {forumId} = req.query;
    if(!forumId){
        res.status(400);
        throw new Error('Forum Id must be passed');
    }
    // TODO: check if the forum exist
    const forumMembers = await ForumMember.findAll({
        where:{
            forumId
        }
    })
    res.status(200).json({
        message: 'Forum members retrieved successfully',
        data: forumMembers
    })
})

// TODO: get all member to invite to forum (exclude the (current | requested | invited) members)

// TODO: status to request | invite member

