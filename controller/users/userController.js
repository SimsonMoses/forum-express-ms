import expressAsyncHandler from 'express-async-handler';
import db from '../../models/index.js';
import jwt from 'jsonwebtoken';

const { User, sequelize,Category } = db;

export const createUser = expressAsyncHandler(async (req, res) => {
    console.log(`Request body: `+req.body);
    
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password
    })
    return res.status(201).json({
        message: 'User Created',
        id: user.id,
        status: "SUCCESS"
    })
})

// TODO: LOGIN
export const login = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        where: {
            email
        }
    })
    if (!user) {
        res.status(401)
        throw new Error('Invalid Email');
    }
    const isMatch = await User.verifyPassword(password, user.password);
    if (!isMatch) {
        res.status(401)
        throw new Error('Invalid Password');
    }
    const token = jwt.sign({
        user: {
            userId: user.id
        }
    }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.setHeader('token', `${token}`); 
    return res.status(200).json({
        message: 'Login Success',
        data:{
            id: user.id,
            name: user.name,
            email: user.email
        },
        status: "SUCCESS"
    })
})

// TOOD: ME
export const me = expressAsyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findOne({
        where: {
            id: userId
        }
    })
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }
    res.status(200).json({
        message: 'User Data',
        status: "SUCCESS",
        data: convertToUserResponse(user)
    })
})

const convertToUserResponse = user => {
    return {
        userId: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        category: user.categories
    }
}

const convertToUserResponses = users => {
    return users.map(user => convertToUserResponse(user));
}

/**
 * fetchUserById 
 */
export const fetchUserById = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    let user = await User.findOne({
        where: {
            id
        },
        include:[
            {
                model: Category,
                as: 'categories',
                attributes: ['id', 'name'],
                through:{attributes:[]}
            }
        ]
    })
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    // let cateogry = await user.getCategories();
    // cateogry = cateogry.map(category => {
    //     return {
    //         categoryId: category.dataValues.id,
    //         categoryName: category.dataValues.name
    //     }
    // });
    // console.log(cateogry);
    // user.category = cateogry;

    res.status(200).json({
        message: 'User Data',
        data: convertToUserResponse(user),
        status: "SUCCESS"
    })
})

/**
 * fetchUsers, params: search, limit, offset
 */
export const fetchUsers = expressAsyncHandler(async (req, res) => {
    const { search, limit = 10, offset = 0 } = req.query;

    const users = await User.findAll({
        where: sequelize.where(
            sequelize.fn('lower', sequelize.col('name')),
            'LIKE',
            `%${search.toLowerCase()}%`
        ),
        limit: +limit,
        offset: +offset
    });
    res.status(200).json({
        message: 'Users Data',
        data: convertToUserResponses(users)
    })
})

// TODO: UPDATE PROFILE
export const updateProfile = expressAsyncHandler(async (req, res) => {
    const { id } = req.user;
    const { name, avatar, categoryIds } = req.body;
    const user = await User.findOne({
        id
    })
    if (!user) {
        throw new Error('User not found');
    }
    user.name = name;
    user.avatar = avatar;
    await user.save();
    // Clear existing associations
    await db.CategoryAssociation.destroy({
        where: { userId: user.id }
    });

    // Add new associations
    const newAssociations = categoryIds.map(categoryId => ({
        userId: user.id,
        categoryId: categoryId, // categoryIds is an array like [35, 36, 37]
    }));
    await db.CategoryAssociation.bulkCreate(newAssociations);
    res.status(200).json({
        message: 'Profile updated successfully'
    })
})