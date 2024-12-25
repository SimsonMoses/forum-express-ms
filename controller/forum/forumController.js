import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";
import { Sequelize,Op } from "sequelize";

const {User, Forum, sequelize } = db;

export const createForum = expressAsyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { name, imageUrl, description, terms } = req.body;
    const forum = await Forum.create({
        name, imageUrl, description, terms, createdBy: userId
    })
    res.status(200)
    return res.json({
        message: `Forum created successfully`,
        data: forum.id
    })
})

// todo: get all forum (filter )
export const fetchAllForum = expressAsyncHandler(async (req, res) => {
    const { limit = 10, offset = 0, search = '', } = req.query;
    let forums = await Forum.findAll({
        where: sequelize.where(
            sequelize.fn('lower', sequelize.col('name')),
            'LIKE',
            `%${search.toLowerCase()}%`
        ),
        limit: +limit,
        offset: +offset
    });
    res.status(200).json({
        message: 'forum retrived successfully',
        data: forums
    })
})

// todo: get all forum of mine
export const fetchAllOwnedForum = async (req, res) => {
    const { search, limit, offset } = req.query;
    const {userId} = req.user;
    console.log(Op); // Should log the Sequelize operators
    let forums = await Forum.findAll({
        where: {
            [Op.and]: [
                sequelize.where(
                    sequelize.fn('lower', sequelize.col('Forum.name')),
                    {
                        [Op.like]: `%${search.toLowerCase()}%`
                    }
                ),
                { createdBy: userId }
            ]
        },
        include:[
            {
                model:User,
                as: 'creator',
                attributes: ['id','email']
            }
        ]
    })
    return res.status(200).json({
        message:'My Forum retrived successfully',
        data:forums
    })
}

// todo: get all forum based on the sector

// todo: get forum by id

// todo: update forum

// Todo: disable forum

// 