const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('giohang', {
    GIOHANG_ID: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true
    },
    USER_NAME: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    USER_ID: {
      type: DataTypes.CHAR(10),
      allowNull: true,
      references: {
        model: 'users',
        key: 'USER_ID'
      }
    },
    TRANGTHAI: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'giohang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "GIOHANG_ID" },
        ]
      },
      {
        name: "FK_GIOHANG_USERS",
        using: "BTREE",
        fields: [
          { name: "USER_ID" },
        ]
      },
    ]
  });
};
