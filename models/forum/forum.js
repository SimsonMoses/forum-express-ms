import {Model} from "sequelize";

export default (sequelize, DataTypes) => {
    class Forum extends Model {
    }

    Forum.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
            },
            imageUrl: {
                type: DataTypes.STRING
            },
            description: {
                type: DataTypes.STRING,
                length: 10000
            },
            status: {
                type: DataTypes.STRING,
                enum: ['in_active', 'active']
            },
            terms: {
                type: DataTypes.STRING // terms and condition url
            },
            createdBy: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            timestamps: true,
            modelName: "Forum",
            tableName: 'forum',
        }
    )

    // Forum.belongsTo(sequelize.models.Category, { foreignKey: 'categoryId', as: 'category' });
    return Forum;
}