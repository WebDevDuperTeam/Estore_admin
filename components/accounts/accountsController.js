const accountsService = require('./accountsService');
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
        let admins;
        let maxNumberOfPages;
        if(name){
            maxNumberOfPages = Math.ceil(await accountsService.countAdminsOfName(name) / itemPerPage);
            admins = await accountsService.listAdminsOfName(itemPerPage, page - 1, name);
        }
        else{
            maxNumberOfPages = Math.ceil(await accountsService.countTotalAdmins() / itemPerPage);
            admins = await accountsService.listAdmins(itemPerPage,page - 1);
        }

        //pass data to view and render
        const paginateInfo = {page, maxNumberOfPages, originalUrl, formLink: '/accounts?page='};
        res.render('accounts', {title: "Accounts Table", admins, accountsActive: req.app.locals.activeSideBarClass, paginateInfo});
    }
    catch (err) {
        res.render('error', {err});
    }

}
