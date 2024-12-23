import { DataTypes, Model } from 'sequelize';

// association

export default  (sequelize, DataTypes) => {
    class User extends Model { }
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
    }
    )
    return User;
}