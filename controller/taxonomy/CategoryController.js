import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";
import {Op} from "sequelize";


const {Category} = db;

export const createCategories = expressAsyncHandler(async (req, res) => {

})

export const getAllCategories = expressAsyncHandler(async (req, res) => {
    const {limit = 10, offset = 0, search} = req.query;

    var searchType = (search) ? {
        type: {
            [Op.like]: `%${search.toLowerCase()}%`
        }
    } : {}

    const categories = await Category.findAll({
        where: searchType,
        limit,
        offset
    })
    return res.status(200).json({
        message: 'Categories retrieved successfully',
        status: "SUCCESS",
        data: categories
    })
})