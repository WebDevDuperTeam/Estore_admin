exports.showPage = (req, res) => {

    res.render('profile', {title: 'Profile', profileActive: req.app.locals.activeSideBarClass});
}