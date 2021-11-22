exports.showPage = (req, res) => {

    res.render('profile', {title: 'profile', profileActive: req.app.locals.activeSideBarClass});
}