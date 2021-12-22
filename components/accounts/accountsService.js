const {models, sequelize} = require('../../models/index');
const users = models.users;
const { Op, where} = require("sequelize");

exports.countTotalAdmins = async () =>{
    return await users.count({
        where: {LA_ADMIN: true}
    }).catch((err) => {throw err});
};

exports.countAdminsOfName = async (name) => {
    return await users.count({
        where: {
            LA_ADMIN: true,
            [Op.or]: [
                {HO: {[Op.substring]: name}},
                {TEN: {[Op.substring]: name}}
            ]
        }
    }).catch((err) => {throw err});
};

exports.listAdminsOfName = async (itemPerPage =6, page=0, name) =>
{
    return await users.findAll({
        offset: page * itemPerPage,
        limit: itemPerPage,
        attribute: ['USER_ID', 'TEN', 'HO', 'EMAIL'],
        raw:true,
        where: {
            LA_ADMIN: true,
            [Op.or]: [
                {HO: {[Op.substring]: name}},
                {TEN: {[Op.substring]: name}}
            ]
        }
    }).catch((err)=>{throw err});
};

exports.listAdmins = async (itemPerPage =6, page=0) =>
{
    return await users.findAll({
        offset: page * itemPerPage,
        limit: itemPerPage,
        attribute: ['USER_ID', 'TEN', 'HO', 'EMAIL'],
        raw:true,
        where: {
            LA_ADMIN: true,
        }
    }).catch((err)=>{throw err});
};

exports.getUserWithToken = async (token) => {
    return await users.findOne({
        raw: true,
        where:{
            [Op.and]: [
                {TOKEN: token},
                {KICH_HOAT: false},
                sequelize.where(
                    sequelize.fn('TIMESTAMPDIFF', sequelize.literal('SECOND'), sequelize.fn('NOW'), sequelize.col('NGAY_HET_HAN_TOKEN')),
                    {[Op.gt]: 0}
                )
            ]
        }
    });
};

exports.getUserWithEmail = async (email, isActive) => {
    return await users.findOne({
        raw: true,
        where: {EMAIL: email, KICH_HOAT: isActive}
    });
};

exports.setNewTokenForUser = async (id, token) => {
    let expires = new Date();
    expires.setHours(expires.getHours() + 24);
    const expiresStr = expires.toISOString();

    try {
        await users.update({TOKEN: token, NGAY_HET_HAN_TOKEN: expiresStr}, {where: {USER_ID: id}});
    }
    catch (err){
        throw err;
    }
}
