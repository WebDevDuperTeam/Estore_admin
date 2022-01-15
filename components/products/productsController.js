const productsService = require('./productsService');
const sizeOf = require("image-size");
const itemPerPage = 6;

exports.showPage = async (req, res) => {
    try {
        //validate info from query string
        let page = req.query.page;
        if(isNaN(page) || page <= 0 || page == null){
            page = 1;
        }
        let name = req.query.name;
        const originalUrl = req.originalUrl;

        //choose service
        let products;
        let maxNumberOfPages;
        if(name){
            maxNumberOfPages = Math.ceil(await productsService.countProductsOfName(name) / itemPerPage);
            products = await productsService.listProductsOfName(itemPerPage, page - 1, name);
        }
        else{
            maxNumberOfPages = Math.ceil(await productsService.countTotalProducts() / itemPerPage);
            products = await productsService.listProducts(itemPerPage,page - 1);
        }

        //pass data to view and render
        const paginateInfo = {page, maxNumberOfPages, originalUrl, formLink: '/products?page='};
        const editProductError = req.session.editProductError;
        res.render('products', {title: "Products Table", products,
            tablesActive: req.app.locals.activeSideBarClass,
            paginateInfo, editProductError});

        //reset session parameters
        req.session['editProductError'] = false;
    }
    catch (err) {
        res.render('error', {err});
    }

}

exports.postProduct = async (req, res) => {
    const request = req.body.btn;

    try {
        switch (request) {
            case 'lock':
                //TODO: test locking a product
                await lockProduct(req);
                break;
            case 'unlock':
                //TODO: test unlocking a product
                await unlockProduct(req);
                break;
            case 'save':
                //TODO: test saving change to a product
                await saveChangeToProduct(req);
                break;
            default:
                //do nothing
                break;
        }
    } catch (e) {
        req.session['editProductError'] = true;
    }
    finally {
        res.redirect('back');
    }
}

async function lockProduct(req) {
    const productId = req.body.productId;
    try{
        await productsService.updateLockStatusOfProduct(productId, true);
    }
    catch (error){throw error;}
}

async function unlockProduct(req) {
    const productId = req.body.productId;
    try{
        await productsService.updateLockStatusOfProduct(productId, false);
    }
    catch (error){throw error;}
}

async function saveChangeToProduct(req) {
    const productId = req.body.productId;
    const productType = req.body.productType;
    const color = req.body.color;
    const gender = req.body.gender;
    const brand = req.body.brand;
    const number = req.body.number;
    const price = req.body.price;

    try {
        await productsService.saveChangeToProduct(productId, productType, color, gender, brand, number, price);
    } catch (err) {
        throw err;
    }
}

exports.uploadImage = (req, res) => {
    //Check file type: must be image
    if (!req.file.mimetype.startsWith('image/')) {
        return res.status(422).json({
            error :'The uploaded file must be an image'
        });
    }

    //Check dimension
    const dimensions = sizeOf(req.file.path);
    if ((dimensions.width < 640) || (dimensions.height < 480)) {
        return res.status(422).json({
            error :'The image must be at least 640 x 480px'
        });
    }

    return res.status(200).send(req.file);
}
