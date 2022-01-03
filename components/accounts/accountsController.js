const accountsService = require('./accountsService');
const itemPerPage = 12;

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
        let users;
        let maxNumberOfPages;
        if(name){
            maxNumberOfPages = Math.ceil(await accountsService.countUsersOfName(name) / itemPerPage);
            users = await accountsService.listUsersOfName(itemPerPage, page - 1, name);
        }
        else{
            maxNumberOfPages = Math.ceil(await accountsService.countTotalUsers() / itemPerPage);
            users = await accountsService.listUsers(itemPerPage,page - 1);
        }

        //pass data to view and render
        const paginateInfo = {page, maxNumberOfPages, originalUrl, formLink: '/accounts?page='};
        res.render('accounts', {title: "Accounts Table", users, accountsActive: req.app.locals.activeSideBarClass, paginateInfo});
    }
    catch (err) {
        res.render('error', {err});
    }
}

exports.lockOrUnlockUser = async (req, res) => {
    const userId = req.body.userId;
    const currentAdmin = res.locals.user;

    //Không cho phép khóa tài khoản của chính mình
    if(currentAdmin.USER_ID === userId){
        res.redirect('back');
    }
    else{
        if(req.body.lockButton){
            try{
                await accountsService.unlockUser(userId);
            }
            catch (err){
                //TODO: Xử lí khi gặp lỗi ko thể mở khóa người dùng
            }
        }
        else if(req.body.unlockButton){
            try{
                await accountsService.lockUser(userId);
            }
            catch (err){
                //TODO: Xử lí khi gặp lỗi ko thể khóa người dùng
            }
        }
        res.redirect('back');
    }
}