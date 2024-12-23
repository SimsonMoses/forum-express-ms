import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import Sequelize from 'sequelize';
import configFile from '../config/config.js';
import User from './user.js';
import Category from './category.js';


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
const loadModels = async () => {
  const files = fs.readdirSync(__dirname);
  for (const file of files) {
    if (
      file.indexOf('.') !== 0 &&
      file.slice(-3) === '.js' &&
      file !== path.basename(__filename)
    ) {
      const modelPath = pathToFileURL(path.join(__dirname, file)).href;
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

db.User = db.User || db['User'];
db.Category = db.Category || db['Category'];

db.User.hasMany(db.Category, { foreignKey: 'userId', as: 'categories' });
db.Category.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;


export default db;
