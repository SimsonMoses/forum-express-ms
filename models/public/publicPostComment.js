import {Model} from "sequelize";


export default (sequelize, DataTypes) => {
    class PublicPostComment extends Model {

    }

    PublicPostComment.init({
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
        // TODO: add the emoji field
    }, {
        sequelize,
        timestamps: true,
        modelName: 'PublicPostComment',
        tableName: 'public_post_comments'
    })
    return PublicPostComment;
}