const {models} = require('../../models/index');
const loai = models.loai;
const kichthuoc = models.kichthuoc;
const thuonghieu = models.thuonghieu;
const quanao = models.quanao;
const { Op } = require("sequelize");

exports.listProducts = () => {
    return quanao.findAll({
        attribute:['MAU', 'GIA', 'SOLUONG', 'GIOITINH', 'kichthuocs.KICHTHUOC', 'LOAI.TEN', 'THUONGHIEU.TEN'],
        include: [{
            model: kichthuoc,
            as:"kichthuocs",
            require: true
        },{
            model: loai,
            as: 'LOAI',
            require: true
        },
        {
            model: thuonghieu,
            as: "THUONGHIEU",
            require: true
        }],
        where: [{
            isArchieve:{[Op.is]: false}
        }]
    }).catch(() => {throw SQLError.SYNTAX_ERR});
};
