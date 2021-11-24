const {models} = require('../../models/index');

exports.list = () => {
    return models.quanao.findAll({raw: true});
};