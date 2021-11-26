const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kichthuoc', {
    QUANAO_ID: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'quanao',
        key: 'QUANAO_ID'
      }
    },
    KICHTHUOC: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'kichthuoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "QUANAO_ID" },
          { name: "KICHTHUOC" },
        ]
      },
    ]
  });
};
