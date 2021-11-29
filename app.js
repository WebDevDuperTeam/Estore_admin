const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const billingRouter = require('./components/billing/billingRouter');
const dashboardRouter = require('./components/dashboard/dashboardRouter');
const profileRouter = require('./components/profile/profileRouter');
const tablesRouter = require('./components/tables/tablesRouter');
const signinRouter = require('./components/account/signinRouter');
const signupRouter = require('./components/account/signupRouter');
const hbs = require("hbs");
const app = express();

//register hbs helper
hbs.registerHelper('isEquals', function(value1, value2) {return value1 === value2;});
hbs.registerHelper("listPage", function (currentPage, maxNumberOfPages, formLink, options) {
  let result = "";
  //calculate (maxPageShown) pages that need rendering
  const maxPageShown = 3;
  const numberOfPageGroups = Math.ceil(maxNumberOfPages / maxPageShown);
  let i = 1;
  for(i = 1; i < numberOfPageGroups; i++){
    if(currentPage < maxPageShown * i + 1){
      break;
    }
  }

  //render (maxPagesShown) pages
  const startPage = maxPageShown * (i - 1) + 1;
  for(let j = startPage; j < startPage + maxPageShown; j++){
    if(j > maxNumberOfPages){
      break;
    }
    //build context (an object with attribute [isActive, productPageLink, pageNumber])
    const context = {active:"", productPageLink: formLink + j, pageNumber: j};
    if(j === parseInt(currentPage)){
      context.active = "active";
    }
    result = result + options.fn(context);
  }

  return result;
});
hbs.registerHelper("previousPageNav", function (currentPage, formLink, options) {
  const context = {pageLink: formLink + (currentPage - 1).toString()};
  if(currentPage === (1).toString()){
    context.pageLink = formLink + (1).toString();
  }
  return options.fn(context);
});
hbs.registerHelper("nextPageNav", function (currentPage, maxNumberOfPages, formLink, options) {
  const context = {pageLink: formLink + (parseInt(currentPage) + 1).toString()};
  if(parseInt(currentPage) === maxNumberOfPages){
    context.pageLink = formLink + currentPage;
  }
  return options.fn(context);
});

//local variables
app.locals.activeSideBarClass = "active bg-gradient-primary";

// view engine setup
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', dashboardRouter);
app.use('/billing', billingRouter);
app.use('/dashboard', dashboardRouter);
app.use('/profile', profileRouter);
app.use('/tables', tablesRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
