const {models} = require('../../models/index');
const users = models.users;
const { Op } = require("sequelize");

exports.countTotalAdmins = async () =>{
    return await users.count({
        where: {LaAdmin: 'ADMIN'}
    }).catch((err) => {throw err});
};

exports.countAdminsOfName = async (name) => {
    return await users.count({
        where: {
            LaAdmin: 'ADMIN',
            [Op.or]: [
                {[Op.like]: {HO: name}},
                {[Op.like]: {TEN: name}}
            ]
        }
    }).catch((err) => {throw err});
};

exports.listAdminsOfName = async (itemPerPage =6, page=0) =>
{
    return await users.findAll({
        offset: page * itemPerPage,
        limit: itemPerPage,
        attribute: ['USER_ID', 'TEN', 'HO', 'EMAIL'],
        raw:true,
        where: {
            LaAdmin: 'ADMIN',
            [Op.or]: [
                {[Op.like]: {HO: name}},
                {[Op.like]: {TEN: name}}
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
            LaAdmin: 'ADMIN'
        }
    }).catch((err)=>{throw err});

};
