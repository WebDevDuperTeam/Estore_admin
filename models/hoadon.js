const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hoadon', {
    HOADON_ID: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true
    },
    GIOHANG_ID: {
      type: DataTypes.CHAR(10),
      allowNull: true,
      references: {
        model: 'giohang',
        key: 'GIOHANG_ID'
      }
    },
    NGAYMUA: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TONGTIEN: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    SDT: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    DIACHI: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'hoadon',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "HOADON_ID" },
        ]
      },
      {
        name: "FK_HOADON_GIOHANG",
        using: "BTREE",
        fields: [
          { name: "GIOHANG_ID" },
        ]
      },
    ]
  });
};
