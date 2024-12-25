import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";
import { Sequelize,Op } from "sequelize";

const {User, Forum, sequelize, ForumCategory,Category } = db;

export const createForum = expressAsyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { name, imageUrl, description, terms, categoryIds } = req.body;
    const forum = await Forum.create({
        name, imageUrl, description, terms, createdBy: userId
    })
    // category association
    const newAssociation = categoryIds.map(categoryId=>{
        return {
            forumId: forum.id,
            categoryId
        }
    })
    await ForumCategory.bulkCreate(newAssociation);
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
        data: convertForumResponses(forums)
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
            },
            {
                model: Category,
                as: 'categories', // Alias defined in the association
                attributes: ['id', 'name'], // Select only the fields you need
                through: { attributes: [] } // which prevents the join table attributes
            },
        ]
    })
    return res.status(200).json({
        message:'My Forum retrived successfully',
        data:convertForumResponses(forums)
    })
}

/** Forum Object
 * Data Transfer Method to restrict the data to be sent to the client
*/
const convertForumResponse = (forum)=>{
    return {
        id:forum.id,
        name:forum.name,
        imageUrl:forum.imageUrl,
        description:forum.description,
        terms:forum.terms,
        creator: forum.creator,
        categories: forum.categories
    }
}

/** Forum List Object
 * Data Transfer Method to restrict the data to be sent to the client
 */

const convertForumResponses = (forums)=>{
    return forums.map(forum=>convertForumResponse(forum))
}

// todo: get all forum based on the sector

// todo: get forum by id

// todo: update forum

// Todo: disable forum

// 