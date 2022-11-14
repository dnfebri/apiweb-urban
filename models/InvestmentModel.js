import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Roles = db.define('investments', {
  kode_inves: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  job: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true
});

export default Roles;