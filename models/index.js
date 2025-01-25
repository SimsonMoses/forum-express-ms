import fs from 'fs';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';
import Sequelize from 'sequelize';
import configFile from '../config/config.js';


const db = {};

// Handle __dirname and __filename in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];


let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    console.log(`config values: ${config.host}, ${config.dialect}, ${config.operatorsAliases}`);
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Dynamically import models
const loadModels = async (dir = __dirname) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {

        const fullPath = path.join(dir, file);

        if (fs.statSync(fullPath).isDirectory()) {
            await loadModels(fullPath);  // Recurse into subdirectory
        }

        if (
            file.indexOf('.') !== 0 &&
            file.slice(-3) === '.js' &&
            file !== path.basename(__filename)
        ) {
            const modelPath = pathToFileURL(fullPath).href;
            const model = (await import(modelPath)).default(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        }
    }

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
};

await loadModels();
console.log(Object.keys(db));

db.User = db.User || db['User'];
db.Category = db.Category || db['Category'];
db.CategoryAssociation = db.CategoryAssociation || db['CategoryAssociation'];
db.Forum = db.Forum || db['Forum'];
db.ForumCategory = db.ForumCategory || db['ForumCategory'];
db.ForumMember = db.ForumMember || db['ForumMember'];
db.ForumMemberRequest = db.ForumMemberRequest || db['ForumMemberRequest'];
db.Post = db.Post || db['Post'];
db.User.belongsToMany(db.Category, {
    through: db.CategoryAssociation,
    foreignKey: 'userId',
    otherKey: 'categoryId',
    as: 'categories',
});

db.Category.belongsToMany(db.User, {
    through: db.CategoryAssociation,
    foreignKey: 'categoryId',
    otherKey: 'userId',
    as: 'users',
});
db.Forum.belongsToMany(db.Category, {
    through: db.ForumCategory,
    foreignKey: 'forumId',
    otherKey: 'categoryId',
    as: 'categories',
});

db.Category.belongsToMany(db.Forum, {
    through: db.ForumCategory,
    foreignKey: 'categoryId',
    otherKey: 'forumId',
    as: 'forums',
});

// db.Forum.belongsToMany(db.User, {
//   through: db.ForumMember,
//   foreignKey: 'forumId',
//   otherKey: 'userId',
//   as: 'members',
// });

db.ForumMember.belongsTo(db.User, {foreignKey: 'userId', as: 'user'});
db.Forum.belongsTo(db.User, {foreignKey: 'createdBy', as: 'creator'});

db.ForumMemberRequest.belongsTo(db.User, {foreignKey: 'userId', as: 'user'});
db.ForumMemberRequest.belongsTo(db.Forum, {foreignKey: 'forumId', as: 'forum'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
