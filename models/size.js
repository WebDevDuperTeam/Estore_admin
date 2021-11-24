const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('size', {
    QUANAO_ID: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'quanao',
        key: 'QUANAO_ID'
      }
    },
    SIZE: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'size',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "QUANAO_ID" },
          { name: "SIZE" },
        ]
      },
    ]
  });
};
