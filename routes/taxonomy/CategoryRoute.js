import express from "express";
import {authenticationHandler} from "../../middleware/authentication.js";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory
} from "../../controller/taxonomy/CategoryController.js";


const categoryRoute = express.Router()

categoryRoute.use(authenticationHandler)


categoryRoute.route('/category').get(getAllCategories).post(createCategory).put(updateCategory).delete(deleteCategory)

export default categoryRoute;