import express from "express";
import {authenticationHandler} from "../../middleware/authentication.js";
import {getAllCategories} from "../../controller/taxonomy/CategoryController.js";


const categoryRoute = express.Router()

categoryRoute.use(authenticationHandler)

categoryRoute.route('/category').get(getAllCategories)

export default categoryRoute;