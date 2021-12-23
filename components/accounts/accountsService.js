const {models, sequelize} = require('../../models/index');
const users = models.users;
const { Op, where} = require("sequelize");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const salt = Number(process.env.BCRYPT_SALT);

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

exports.getUserWithToken = async (id, token, isActive) => {
    const user = await users.findOne({
        raw: true,
        where:{
            [Op.and]: [
                {USER_ID: id},
                {KICH_HOAT: isActive},
                sequelize.where(
                    sequelize.fn('TIMESTAMPDIFF', sequelize.literal('SECOND'), sequelize.fn('NOW'), sequelize.col('NGAY_HET_HAN_TOKEN')),
                    {[Op.gt]: 0}
                )
            ]
        }
    });

    if(user) {
        const isValidToken = bcrypt.compare(token, user.TOKEN);
        if (isValidToken) {
            return user;
        }
    }
    return null;
};

exports.getUserWithEmail = async (email, isActive) => {
    return await users.findOne({
        raw: true,
        where: {EMAIL: email, KICH_HOAT: isActive}
    });
};

exports.getUserWithId = async (id, isActive) => {
    return await users.findOne({
        where: {USER_ID: id, KICH_HOAT: isActive}
    });
}

exports.setNewTokenForUser = async (id) => {
    let expires = new Date();
    expires.setHours(expires.getHours() + 24);
    const expiresStr = expires.toISOString();
    const token = crypto.randomBytes(64).toString('hex');
    const hashedToken = await bcrypt.hash(token, salt);

    try {
        await users.update({TOKEN: hashedToken, NGAY_HET_HAN_TOKEN: expiresStr}, {where: {USER_ID: id}});
        return token;
    }
    catch (err){
        throw err;
    }
}
