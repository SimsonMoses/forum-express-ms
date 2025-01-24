import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";
import {Op} from "sequelize";

const {User, Forum, sequelize, ForumCategory, Category} = db;


let categoryInclude = {
    model:Category,
    as: 'categories',
    attributes: ['id', 'name'],
    through: {attributes: []}
}


export const createForum = expressAsyncHandler(async (req, res) => {
    const {userId} = req.user;
    const {name, imageUrl, description, terms, categoryIds} = req.body;
    const forum = await Forum.create({
        name, imageUrl, description, terms, createdBy: userId
    })
    // category association
    const newAssociation = categoryIds.map(categoryId => {
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
    const {limit = 10, offset = 0, search = '', categoryId = []} = req.query;
    const categoryIds = Array.isArray(categoryId) ? categoryId.map(Number) : categoryId.split(',').map(Number);

    const categoryCondition = {
        model: Category,
        as: 'categories',
        attributes: ['id', 'name'],
        through: {attributes: []}
    }

    if (categoryId && categoryIds.length > 0) {
        console.log('category id passed');
        categoryCondition.where = {
            id: {[Op.in]: categoryIds}
        }
    }
    let forums = await Forum.findAll({
        where: sequelize.where(
            sequelize.fn('lower', sequelize.col('name')),
            'LIKE',
            `%${search.toLowerCase()}%`
        ),
        include: [
            categoryCondition
        ],
        limit: +limit,
        offset: +offset
    });
    res.status(200).json({
        message: 'forum retrived successfully',
        data: convertForumResponses(forums),
        status: "SUCCESS"
    })
})

// todo: get all forum of mine
export const fetchAllOwnedForum = async (req, res) => {
    const {search = "", limit, offset, categoryId = []} = req.query;
    const categoryIds = Array.isArray(categoryId) ? categoryId.map(Number) : categoryId.split(',').map(Number);
    const categoryCondition = {
        model: Category,
        as: 'categories', // Alias defined in the association
        attributes: ['id', 'name'], // Select only the fields you need
        through: {attributes: []}, // which prevents the join table attributes
    }
    if (categoryId && categoryIds.length > 0) {
        console.log('category id passed');
        categoryCondition.where = {
            id: {[Op.in]: categoryIds}
        }
    }
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
                {createdBy: userId}
            ]
        },
        include: [
            {
                model: User,
                as: 'creator',
                attributes: ['id', 'email']
            },
            categoryCondition
        ]
    })
    return res.status(200).json({
        message: 'My Forum retrived successfully',
        data: convertForumResponses(forums)
    })
}

/** Forum Object
 * Data Transfer Method to restrict the data to be sent to the client
 */
const convertForumResponse = (forum) => {
    return {
        id: forum.id,
        name: forum.name,
        imageUrl: forum.imageUrl,
        description: forum.description,
        terms: forum.terms,
        creator: forum.creator,
        categories: forum.categories
    }
}

/** Forum List Object
 * Data Transfer Method to restrict the data to be sent to the client
 */

export const convertForumResponses = (forums) => {
    return forums.map(forum => convertForumResponse(forum))
}

// todo: get all forum based on the category
export const fetchForumByCategory = expressAsyncHandler(async (req, res) => {
    const {categoryId = []} = req.query;
    // const categoryId = [37,38];
    const categoryIds = Array.isArray(categoryId) ? categoryId.map(Number) : categoryId.split(',').map(Number);
    let categoryCondition = {
        model: Category,
        as: 'categories',
        attributes: ['id', 'name'],
        through: {attributes: []},
    }
    if (categoryId && categoryIds.length > 0) {
        console.log('category id passed');
        categoryCondition.where = {
            id: {[Op.in]: categoryIds}
        };
    }
    const forums = await Forum.findAll({
        include: [
            categoryCondition
        ]
    })
    return res.status(200).json({
        message: 'Forum retrieved successfully',
        data: convertForumResponses(forums)
    })
})

// todo: get forum by id
export const fetchForumById = expressAsyncHandler(async (req,res)=>{
    const {userId} = req.user;
    const id = req.params.id;
    if(!id){
        res.status(400)
        throw new Error('Forum Id must be passed')
    }
    console.log('id',id);
    const forum = await Forum.findOne({
        where:{
            id,
        },
        include:[
            categoryInclude,
        ]
    });
    if(!forum){
        res.status(404);
        throw new Error('Forum not found');
    }
    return res.status(200).json({
        message: 'Forum retrieved successfully',
        data: convertForumResponse(forum)
    })
})

// todo: update forum
export const updateForum = expressAsyncHandler(async(req,res)=>{
    const id = req.params.id;
    if(!id){
        res.status(400);
        throw new Error('Forum Id must be passed');
    }
    const {name, imageUrl, description, terms} = req.body;
    const forum = await Forum.update({name, imageUrl, description, terms},{
        where:{id}
    });
    if(!forum){
        res.status(404);
        throw new Error('Forum not found');
    }
    res.status(200).json({
        message: 'Forum updated successfully'
    })
})

// Todo: disable forum

// 