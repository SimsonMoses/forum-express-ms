import {Model} from "sequelize";

export default (sequelize,Datatypes)=>{
    class ForumMemberRequest extends Model{

    }

    ForumMemberRequest.init({
        id:{
            type: Datatypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        forumId:{
            type: Datatypes.INTEGER,
            allowNull: false
        },
        userId:{
            type: Datatypes.INTEGER,
            allowNull: false
        },
        status:{
            type: Datatypes.STRING,
            default: 'pending',
            validate:{
                isIn: [['pending','accepted','rejected']]
            },
        },
        requestType:{
            type: Datatypes.STRING,
            allowNull: false,
            validate:{
                isIn: [['join','invite']]
            }
        }
    },{
        sequelize,
        timestamps:true,
        modelName:'ForumMemberRequest',
        tableName:'forum_member_requests',
        indexes:[
            {
                fields:['forumId','userId'],
                unique:true,
                name:'forum_user_unique_idx'
            }
        ]
    })
    return ForumMemberRequest;

}