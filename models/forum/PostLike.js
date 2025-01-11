import {Model} from "sequelize";

/** Like Model for Post and Comment
 * based on the type of the like, the postId or commentId will be set
 * */
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
            allowNull:true
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        commentId:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        categoryType:{
            type:DataTypes.ENUM('POST','COMMENT'),
            allowNull:false
        },
        emoji:{ //TODO: like, dislike, love, angry, sad, happy, need to implement emoji
            type:DataTypes.STRING,
            allowNull:true
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
            },
            {
                fields:['commentId','userId'],
                unique:true,
                name:'comment_like_unique_index'
            }

        ]
    })

    PostLike.addHook('afterSync',async ()=>{
        const query = `
        ALTER TABLE post_likes
        ADD CONSTRAINT category_type_check
        CHECK (
            (categoryType = 'POST' AND postId IS NOT NULL AND commentId IS NULL) OR
            (categoryType = 'COMMENT' AND postId IS NULL AND commentId IS NOT NULL)
            );
        `;
        await sequelize.query(query).catch(err=>{
            if(!err.message.includes('already exists')){
                console.log(err.message);
            }
        });
    });


    return PostLike;
}