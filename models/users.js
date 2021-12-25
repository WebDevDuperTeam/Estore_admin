const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    USER_ID: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
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
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    SO_BANKING: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      defaultValue: "0"
    },
    PASS: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    LA_ADMIN: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    KICH_HOAT: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    TOKEN: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: "0"
    },
    NGAY_HET_HAN_TOKEN: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
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
