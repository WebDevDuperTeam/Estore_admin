const DataTypes = require("sequelize").DataTypes;
const _binhluan = require("./binhluan");
const _ct_giohang = require("./ct_giohang");
const _ct_hoadon = require("./ct_hoadon");
const _giohang = require("./giohang");
const _hoadon = require("./hoadon");
const _loai = require("./loai");
const _quanao = require("./quanao");
const _size = require("./size");
const _users = require("./users");

function initModels(sequelize) {
  const binhluan = _binhluan(sequelize, DataTypes);
  const ct_giohang = _ct_giohang(sequelize, DataTypes);
  const ct_hoadon = _ct_hoadon(sequelize, DataTypes);
  const giohang = _giohang(sequelize, DataTypes);
  const hoadon = _hoadon(sequelize, DataTypes);
  const loai = _loai(sequelize, DataTypes);
  const quanao = _quanao(sequelize, DataTypes);
  const size = _size(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  giohang.belongsToMany(quanao, { as: 'QUANAO_ID_quanaos', through: ct_giohang, foreignKey: "GIOHANG_ID", otherKey: "QUANAO_ID" });
  hoadon.belongsToMany(quanao, { as: 'QUANAO_ID_quanao_ct_hoadons', through: ct_hoadon, foreignKey: "HOADON_ID", otherKey: "QUANAO_ID" });
  quanao.belongsToMany(giohang, { as: 'GIOHANG_ID_giohangs', through: ct_giohang, foreignKey: "QUANAO_ID", otherKey: "GIOHANG_ID" });
  quanao.belongsToMany(hoadon, { as: 'HOADON_ID_hoadons', through: ct_hoadon, foreignKey: "QUANAO_ID", otherKey: "HOADON_ID" });
  ct_giohang.belongsTo(giohang, { as: "GIOHANG", foreignKey: "GIOHANG_ID"});
  giohang.hasMany(ct_giohang, { as: "ct_giohangs", foreignKey: "GIOHANG_ID"});
  hoadon.belongsTo(giohang, { as: "GIOHANG", foreignKey: "GIOHANG_ID"});
  giohang.hasMany(hoadon, { as: "hoadons", foreignKey: "GIOHANG_ID"});
  ct_hoadon.belongsTo(hoadon, { as: "HOADON", foreignKey: "HOADON_ID"});
  hoadon.hasMany(ct_hoadon, { as: "ct_hoadons", foreignKey: "HOADON_ID"});
  quanao.belongsTo(loai, { as: "LOAI", foreignKey: "LOAI_ID"});
  loai.hasMany(quanao, { as: "quanaos", foreignKey: "LOAI_ID"});
  binhluan.belongsTo(quanao, { as: "QUANAO", foreignKey: "QUANAO_ID"});
  quanao.hasMany(binhluan, { as: "binhluans", foreignKey: "QUANAO_ID"});
  ct_giohang.belongsTo(quanao, { as: "QUANAO", foreignKey: "QUANAO_ID"});
  quanao.hasMany(ct_giohang, { as: "ct_giohangs", foreignKey: "QUANAO_ID"});
  ct_hoadon.belongsTo(quanao, { as: "QUANAO", foreignKey: "QUANAO_ID"});
  quanao.hasMany(ct_hoadon, { as: "ct_hoadons", foreignKey: "QUANAO_ID"});
  size.belongsTo(quanao, { as: "QUANAO", foreignKey: "QUANAO_ID"});
  quanao.hasMany(size, { as: "sizes", foreignKey: "QUANAO_ID"});
  giohang.belongsTo(users, { as: "USER", foreignKey: "USER_ID"});
  users.hasMany(giohang, { as: "giohangs", foreignKey: "USER_ID"});

  return {
    binhluan,
    ct_giohang,
    ct_hoadon,
    giohang,
    hoadon,
    loai,
    quanao,
    size,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
