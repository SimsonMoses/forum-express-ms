import {authenticationHandler} from "../../middleware/authentication.js";
import categoryRoute from "./CategoryRoute.js";


const taxonomyRoute = express.Route()

taxonomyRoute.use(authenticationHandler)

taxonomyRoute.use('/category', categoryRoute)

export default taxonomyRoute