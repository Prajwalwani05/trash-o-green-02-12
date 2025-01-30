const { DataTypes } = require('sequelize');
const {sequelize} = require('../db/dbConnection');

const Trashman = sequelize.define('Trashman', {
  role: {
    type: DataTypes.STRING,
    allowNull: true
  },
  trashmanId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trashmanNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Ensure that each number is unique
    autoIncrement: true, // Auto increment this number
    primaryKey: true, // Make it the primary key
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  document: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'trashman', 
  timestamps: true,
  hooks: {
    beforeSave: async (trashman, options) => {
      if (!trashman.trashmanId) {
        // Ensure trashmanId is set after the number is generated
        trashman.trashmanId = `GreenMan-${String(trashman.name)}`;
      }
    }
  }
});

// Ensure the trashmanNumber is auto-incremented in the database
Trashman.sync({ alter: true });

module.exports = Trashman;
