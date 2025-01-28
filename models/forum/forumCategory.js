import { Model } from "sequelize";

export default (sequelize, DataTypes)=>{

    class ForumCategory extends Model{

    }

    ForumCategory.init(
        {
            id:{
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true
            },
            forumId:{
                type:DataTypes.INTEGER,
                references:{
                    model:'forum',
                    key:'id'
                }
            },
            categoryId:{
                type:DataTypes.INTEGER,
                references:{
                    model:'category',
                    key: 'id'
                }
            }
        },{
            sequelize,
            timestamps:true,
            modelName:'ForumCategory',
            tableName:'forum_category'
        }
    )

    // ForumCategory.belongsTo(sequelize.models.Forum,{foreignKey:'forumId', as: 'forum' });
    // ForumCategory.belongsTo(sequelize.models.Category,{foreignKey:'categoryId', as: 'category' });
    return ForumCategory;
}