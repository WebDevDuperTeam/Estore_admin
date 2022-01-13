const {models} = require('../../models/index');
const loai = models.loai;
const kichthuoc = models.kichthuoc;
const thuonghieu = models.thuonghieu;
const quanao = models.quanao;
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
        },{
            model: thuonghieu,
            as: "THUONGHIEU",
            require: true
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
        },{
            model: thuonghieu,
            as: "THUONGHIEU",
            require: true
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
        }]
    }).catch((err) => {throw err});
};

exports.updateLockStatusOfProduct = async (id, lockStatus) => {
    try{
        await quanao.update({DA_XOA: lockStatus}, {where:{QUANAO_ID: id}});
    }
    catch (err) {throw err;}
}

exports.saveChangeToProduct = async (id, productType, color, gender, brand, number, price) => {
    //Check productType and brand validity. If not exists, add that new type or brand
    const type = await findProductTypeOfName(productType);
    const existedBrand = await findBrandOfName(brand);
    let typeId, brandId;
    if (!type) {  //Cannot found type of such name
        const newType = await addNewType(productType);
        typeId = newType.LOAI_ID;
    } else {
        typeId = type.LOAI_ID;
    }
    if(!existedBrand){  //Cannot found such brand in db
        const newBrand = await addNewBrand(brand);
        brandId = newBrand.THUONGHIEU_ID;
    }
    else{
        brandId = existedBrand.THUONGHIEU_ID;
    }

    //save change to product
    try {
        await quanao.update({
            LOAI_ID: typeId,
            MAU: color,
            THUONGHIEU_ID: brandId,
            GIA: price,
            SO_LUONG: number,
            GIOI_TINH: gender
        }, {where: {QUANAO_ID: id}})
    } catch (e) {throw e;}
}

async function addNewBrand(name) {
    return await thuonghieu.create({TEN_THUONG_HIEU: name});
}

async function addNewType(name) {
    return await loai.create({TEN_LOAI: name});
}

async function findBrandOfName(name) {
    return await thuonghieu.findOne({
        raw: true,
        where:{
            TEN_THUONG_HIEU: name
        }
    });
}

async function findProductTypeOfName(name) {
    return await loai.findOne({
        raw: true,
        where:{
            TEN_LOAI: name
        }
    });
}