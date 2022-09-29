import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Roles from "./RoleModel.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
  uuid: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  freezeTableName: true
});

Roles.hasMany(Users);
Users.belongsTo(Roles, {foreignKey: 'roleId'});

export default Users;