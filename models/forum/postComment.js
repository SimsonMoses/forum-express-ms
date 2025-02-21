import {Model} from "sequelize";


export default (sequelize, DataTypes) => {
    class PostComment extends Model {

    }

    PostComment.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: true,
        modelName: 'PostComment',
        tableName: 'post_comments'
    })
    return PostComment;
}