const {models} = require('../../models/index');
const loai = models.loai;
const kichthuoc = models.kichthuoc;
const thuonghieu = models.thuonghieu;
const quanao = models.quanao;
const users=models.users;
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
                TENLOAI: {[Op.substring]: name}
            }]
        },
            {
                model: thuonghieu,
                as: "THUONGHIEU",
                require: true
            }],
        where: [{
            DAXOA: {[Op.is]: false},
        }]
    }).catch((err) => {throw err});
};

exports.listProductsOfName = (itemPerPage =6, page = 0, name) => {
    return quanao.findAll({
        offset: page * itemPerPage,
        limit: itemPerPage,
        attribute:['MAU', 'GIA', 'SOLUONG', 'GIOITINH'],
        include: [{
            model: kichthuoc,
            as:"kichthuocs",
            require: true
        },{
            model: loai,
            as: 'LOAI',
            require: true,
            where: [{
                TENLOAI: {[Op.substring]: name}
            }]
        },
        {
            model: thuonghieu,
            as: "THUONGHIEU",
            require: true
        }],
        where: [{
            DAXOA: {[Op.is]: false},
        }]
    }).catch((err) => {throw err});
};

exports.listProducts = (itemPerPage =6, page = 0) => {
    return quanao.findAll({
        offset: page * itemPerPage,
        limit: itemPerPage,
        attribute:['MAU', 'GIA', 'SOLUONG', 'GIOITINH'],
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
            DAXOA: {[Op.is]: false}
        }]
    }).catch((err) => {throw err});
};
exports.listAdmins = (itemPerPage =6, page=0) =>
{
    return users.findAll({
        offset: page * itemPerPage,
        limit: itemPerPage,
        attribute: ['USER_ID', 'TEN', 'HO', 'EMAIL'],
        raw:true,
        where: [{
            LaAdmin: 'ADMIN'
        }]
    }).catch((err)=>{throw err});

};