const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create our usermodel
class User extends Model {}

//define table columns and configuration
User.init(
    {
        //TABLE COLUMNS GO HERE
        //define an id column
        id: {
            //use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            //this is the equivalent of SQL's 'NOT NULL'
            allowNull: false,
            //instruct that this is the Primary Key
            primaryKey: true,
            //turn on auto increment
            autoIncrement: true
        },
        //define username
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicates
            unique: true,
            //if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        //define a password
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    
    {
        hooks: {
            //set up beforeCreate lifecycle "hook" functionallity
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            //ser up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        //TABLE CONFIGURATION GOES HERE

        //pass in our inported sequelize connection (the direct connection to our db)
        sequelize,
        //dont automatically creat createAt/updateAt timestamp fields
        timestamps: false,
        //dont pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camelcase 
        underscored: true,
        //make it so our model name stays lowercase in the db
        modelName: 'user'
    }
);

module.exports = User;