const tablesService = require('./tablesService');
const itemPerPage = 6;

exports.showPage = async (req, res) => {
    try {
        let numberOfPossiblePages =  Math.ceil(await tablesService.countTotalProducts() / itemPerPage);
        let productPage = req.query.productPage;
        if(isNaN(productPage) || productPage <= 0 || productPage == null){
            productPage = 1;
        }
        products = await tablesService.listProducts(itemPerPage,productPage - 1);

        res.render('tables', {title: "Data tables", tablesActive: req.app.locals.activeSideBarClass, products, productPage, numberOfPossiblePages});
    }
    catch (err) {
        res.render('error', {err});
    }

}