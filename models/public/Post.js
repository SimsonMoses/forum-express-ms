import {Model} from "sequelize";

export default (sequelize, DataTypes) => {
    class Post extends Model {

    }

    Post.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        isPinned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isLocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        files: {
            type: DataTypes.JSON,
            defaultValue: []
        }
    }, {
        sequelize,
        timestamps: true,
        modelName: 'ForumPost',
        tableName: 'forum_posts'
    })
    return Post;
}