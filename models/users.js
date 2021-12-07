const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    USER_ID: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true
    },
    TEN: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    HO: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    EMAIL: {
      type: DataTypes.CHAR(20),
      allowNull: true
    },
    SO_BANKING: {
      type: DataTypes.CHAR(20),
      allowNull: true
    },
    PASS: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    LaAdmin: {
      type: DataTypes.CHAR(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "USER_ID" },
        ]
      },
    ]
  });
};
