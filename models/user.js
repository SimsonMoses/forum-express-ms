import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
// association

export default (sequelize, DataTypes) => {
    class User extends Model { 
        static async verifyPassword(password, hashPassword){
            return await bcrypt.compare(password, hashPassword);
        }
    }
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
                unique: {
                    name: 'unique_email_constraint',
                    msg: 'Email must be unique'
                },
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
        hooks: {
            // ** Hashing password before creating user
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            // ** Hashing password before updating user
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.getSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }

        }
    }
    )
    return User;
}