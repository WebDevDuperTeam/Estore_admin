const {models} = require('../../models/index');
const loai = models.loai;
const kichthuoc = models.kichthuoc;
const thuonghieu = models.thuonghieu;
const quanao = models.quanao;
const { Op } = require("sequelize");

exports.countTotalProducts = () =>{
    return quanao.count();
};

exports.listProducts = (itemPerPage =6, page = 0) => {
    return quanao.findAll({
        offset: page * itemPerPage,
        limit: itemPerPage,
        attribute:['MAU', 'GIA', 'SOLUONG', 'GIOITINH', 'kichthuocs.KICHTHUOC', 'LOAI.TENLOAI','THUONGHIEU.TENTHUONGHIEU'],
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
            DAXOA: {[Op.is]: false}
        }]
    }).catch((err) => {throw err});
};
