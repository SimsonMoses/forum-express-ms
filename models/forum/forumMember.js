import { Model } from 'sequelize';

export default (sequelize, DataTypes) =>{
    class ForumMember extends Model{
    }
    ForumMember.init({
        forumMemberId:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        forumId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        role:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                isIn: [['admin', 'member']]
            }
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                isIn: [['active', 'inactive']]
            }
        }
    },{
        sequelize,
        timestamps: true,
        modelName: 'ForumMember',
        tableName: 'forum_members',
        indexes:[
            {
                fields:['forumId','userId'],
                unique:true,
                name:'forum_user_unique_idx'
            }
        ]
    })
    return ForumMember;
}