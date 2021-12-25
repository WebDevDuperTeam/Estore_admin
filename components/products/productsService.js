const {models} = require('../../models/index');
const loai = models.loai;
const kichthuoc = models.kichthuoc;
const thuonghieu = models.thuonghieu;
const quanao = models.quanao;
const users = models.users;
const { Op } = require("sequelize");

exports.countTotalProducts = () =>{
    return quanao.count();
};

exports.countProductsOfName = (name) => {
    return quanao.count({
        include: [{
            model: kichthuoc,
            as:"kichthuocs",
            require: true
        },{
            model: loai,
            as: 'LOAI',
            require: true,
            where: [{
                TEN_LOAI: {[Op.substring]: name}
            }]
        },
            {
                model: thuonghieu,
                as: "THUONGHIEU",
                require: true
            }],
        where: [{
            DA_XOA: {[Op.is]: false},
        }]
    }).catch((err) => {throw err});
};

exports.listProductsOfName = (itemPerPage =6, page = 0, name) => {
    return quanao.findAll({
        offset: page * itemPerPage,
        limit: itemPerPage,
        attribute:['MAU', 'GIA', 'SO_LUONG', 'GIOI_TINH'],
        include: [{
            model: kichthuoc,
            as:"kichthuocs",
            require: true
        },{
            model: loai,
            as: 'LOAI',
            require: true,
            where: [{
                TEN_LOAI: {[Op.substring]: name}
            }]
        },
        {
            model: thuonghieu,
            as: "THUONGHIEU",
            require: true
        }],
        where: [{
            DA_XOA: {[Op.is]: false},
        }]
    }).catch((err) => {throw err});
};

exports.listProducts = (itemPerPage =6, page = 0) => {
    return quanao.findAll({
        offset: page * itemPerPage,
        limit: itemPerPage,
        attribute:['MAU', 'GIA', 'SO_LUONG', 'GIOI_TINH'],
        include: [{
            model: kichthuoc,
            as:"kichthuocs",
            require: true
        },{
            model: loai,
            as: 'LOAI',
            require: true
        },{
            model: thuonghieu,
            as: "THUONGHIEU",
            require: true
        }],
        where: [{
            DA_XOA: {[Op.is]: false}
        }]
    }).catch((err) => {throw err});
};
