import {  Model } from 'sequelize';

export default (sequelize,DataTypes)=>{
    class CategoryAssociation extends Model{

    }

    CategoryAssociation.init({
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        userId:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'users',
                key:'id'
            }
        },
        categoryId:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'category',
                key:'id'
            }
        }
    },{
        sequelize,
        modelName: 'CategoryAssociation',
        tableName: 'category_association',
        timestamps: true,
    })
    return CategoryAssociation;
}