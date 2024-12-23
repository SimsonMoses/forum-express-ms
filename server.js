import express from 'express';
import userRouter from './routes/userRoute.js';
import db from './models/index.js'
import {errorHandler} from './middleware/errorHandler.js';
import { authenticationHandler } from './middleware/authentication.js';
import importCategoriesFromExcel from './seeders/category/category_insertion.js';
import { syncDatabase } from './seeders/category/index.js';

const app = express();

app.use(express.json());
const port = process.env.PORT || 8080;

// PRE MIDDLEWARE

// ROUTES
app.get('/', (req, res) => {
    res.send('Hello World');
})
app.use('/api/user', userRouter);
// POST MIDDLEWARE
app.use(errorHandler);

// LISTEN

const loadSequelize = async () => {
    const { sequelize } = db;
    sequelize.sync({ alter: true }) // Use `alter: true` to make minor changes to the table structure
        .then(() => {
            console.log('Database synchronized successfully.');
            syncDatabase();
        })
        .catch(error => {
            console.error('Error synchronizing database:', error);
        });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    loadSequelize();

})