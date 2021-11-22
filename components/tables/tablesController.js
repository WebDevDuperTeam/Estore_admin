exports.showPage = (req, res) => {
    res.render('tables', {title: "Data tables", tablesActive: req.app.locals.activeSideBarClass});
}