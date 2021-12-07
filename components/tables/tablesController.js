const tablesService = require('./tablesService');
const itemPerPage = 6;

exports.showPage = async (req, res) => {
    try {
        //validate info from query string
        let productPage = req.query.productPage;
        if(isNaN(productPage) || productPage <= 0 || productPage == null){
            productPage = 1;
        }
        let productName = req.query.productName;
        const originalUrl = req.originalUrl;

        //choose service
        let products;
        let maxNumberOfPages;
        if(productName){
            maxNumberOfPages = Math.ceil(await tablesService.countProductsOfName(productName) / itemPerPage);
            products = await tablesService.listProductsOfName(itemPerPage, productPage - 1, productName);
        }
        else{
            maxNumberOfPages = Math.ceil(await tablesService.countTotalProducts() / itemPerPage);
            products = await tablesService.listProducts(itemPerPage,productPage - 1);
        }

        //pass data to view and render
        const paginateInfo = {productPage, maxNumberOfPages, originalUrl, formLink: '/tables?productPage='};

        // data admin to view and render
        const admins =await tablesService.listAdmins();

        res.render('tables', {title: "Data tables", products, tablesActive: req.app.locals.activeSideBarClass, paginateInfo, admins});
    }
    catch (err) {
        res.render('error', {err});
    }

}
