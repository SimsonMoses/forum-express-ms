import {Model} from "sequelize";


export default (sequelize,DataTypes)=>{
    class PostLike extends Model{

    }
    PostLike.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        postId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    },{
        sequelize,
        timestamps:true,
        modelName:'PostLike',
        tableName:'post_likes',
        indexes:[
            {
                fields:['postId','userId'],
                unique:true,
                name:'post_like_unique_index'
            }
        ]
    })
    return PostLike;
}