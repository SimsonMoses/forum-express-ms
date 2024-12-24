import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";

const {Forum} = db;

export const createForum = expressAsyncHandler(async(req,res)=>{
    const {userId} = req.user;
    const {name,imageUrl,description,terms} = req.body;
    const forum = await Forum.create({
        name,imageUrl,description,terms,createdBy:userId
    })
    res.status(200)
    return res.json({
        message:`Forum created successfully`,
        data: forum.id
    })
})

// todo: get all forum (filter )

// todo: get all forum of mine

// todo: get all forum based on the sector

// todo: get forum by id

// todo: update forum

// Todo: disable forum

// 