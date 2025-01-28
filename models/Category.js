import {  Model } from 'sequelize';

export default (sequelize,DataTypes)=>{
    class Category extends Model{

    }
    Category.init({
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false,
            unique:{
                name:'unique_category_constraint',
                msg:'Category must be unique'
            }
        }
    },{
        sequelize,
        modelName: 'Category',
        tableName: 'category',
        timestamps: true,
    })
    return Category;
}