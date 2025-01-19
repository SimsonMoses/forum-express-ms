import {Model} from "sequelize";


export default (sequelize, DataTypes)=>{
    class PostReport extends Model{

    }

    PostReport.init({
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
        },
        remark:{
            type:DataTypes.STRING,
            allowNull:true
        },
        categoryType:{
            type:DataTypes.ENUM('POST','COMMENT'),
            allowNull:false
        },
        status:{
            type:DataTypes.ENUM('PENDING','APPROVED','REJECTED'),
            allowNull:false,
            defaultValue:'PENDING'
        },
        actionBy:{
            type:DataTypes.INTEGER,
            allowNull:true
        }

    },{
        sequelize,
        timestamps:true,
        modelName:'PostReport',
        tableName:'post_reports',
    })



    return PostReport;
}