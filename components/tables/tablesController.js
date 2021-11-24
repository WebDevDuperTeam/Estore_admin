const tablesService = require('./tablesService');

exports.showPage = async (req, res) => {
    const products = await tablesService.list();
    res.render('tables', {title: "Data tables", tablesActive: req.app.locals.activeSideBarClass, products});
}