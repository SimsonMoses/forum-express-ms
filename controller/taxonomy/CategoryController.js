import expressAsyncHandler from "express-async-handler";
import db from "../../models/index.js";
import {Op} from "sequelize";


const {Category, ForumCategory} = db;

export const createCategory = expressAsyncHandler(async (req, res) => {
    // Check already exist exact matches
    const {name} = req.body;
    const isCategoryExists = await Category.findOne({
        where: {
            name
        }
    })
    if (isCategoryExists) {
        throw new Error("Category already exists")
    }
    const category = await Category.create({
        name
    });
    res.status(200).json({
        message: "Category Created Successfully",
        status: "SUCCESS",
        data: category.id
    })

})

export const getAllCategories = expressAsyncHandler(async (req, res) => {
    const {limit = 10, offset = 0, search} = req.query;
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);
    var searchType = (search) ? {
        name: {
            [Op.like]: `%${search.toLowerCase()}%`
        }
    } : {}
    const totalRecord = await Category.count({
        where: searchType
    })
    const categories = await Category.findAll({
        where: searchType,
        limit: parsedLimit,
        offset: parsedOffset
    })
    return res.status(200).json({
        message: 'Categories List retrieved successfully',
        status: "SUCCESS",
        totalRecord: totalRecord,
        data: categories,
    })
})

export const updateCategory = expressAsyncHandler(async (req, res) => {
    const {categoryId, name} = req.body;

    const category = await Category.update({name}, {
        where: {id: categoryId}
    })
    if (!category) {
        throw new Error("Failed to update the category")
    }
    return res.status(200).json({
        message: "category updated successfully",
        status: "SUCCESS",
        data: category.id
    })
})

export const deleteCategory = expressAsyncHandler(async (req, res) => {
    const {categoryId} = req.query;

    // TODO: Validate whether the data is mapped to any record
    const isMapped = await ForumCategory.findAll({
        where: {
            categoryId: categoryId
        }
    })
    if (isMapped.length>0) {
        console.log(isMapped)
        throw new Error("Category is mapped with other Module")
    }
    const result = await Category.destroy({
        where:{
            id: categoryId
        }
    })
    if (!result) {
        res.status(400)
        throw new Error("Error in deleting the Category")
    }
    return res.status(204).json({
        message: "Category deleted successfully",
        data: result.valueOf(),
        status: "SUCCESS"
    })
})