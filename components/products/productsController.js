const tablesService = require('./productsService');
const itemPerPage = 6;

exports.showPage = async (req, res) => {
    try {
        //validate info from query string
        let productPage = req.query.page;
        if(isNaN(productPage) || productPage <= 0 || productPage == null){
            productPage = 1;
        }
        let name = req.query.name;
        const originalUrl = req.originalUrl;

        //choose service
        let products;
        let maxNumberOfPages;
        if(name){
            maxNumberOfPages = Math.ceil(await tablesService.countProductsOfName(name) / itemPerPage);
            products = await tablesService.listProductsOfName(itemPerPage, productPage - 1, name);
        }
        else{
            maxNumberOfPages = Math.ceil(await tablesService.countTotalProducts() / itemPerPage);
            products = await tablesService.listProducts(itemPerPage,productPage - 1);
        }

        //pass data to view and render
        const paginateInfo = {productPage, maxNumberOfPages, originalUrl, formLink: '/products?page='};
        res.render('products', {title: "Products Table", products, tablesActive: req.app.locals.activeSideBarClass, paginateInfo});
    }
    catch (err) {
        res.render('error', {err});
    }

}
