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
hbs.registerHelper("listPage", function (currentPage, totalPagesPossible) {
  let result = "";

  //calculate (maxPageShown) pages that need rendering
  const maxPageShown = 3;
  const numberOfPageGroups = Math.ceil(totalPagesPossible / maxPageShown);
  let i = 1;
  for(i = 1; i < numberOfPageGroups; i++){
    if(currentPage < maxPageShown * i + 1){
      break;
    }
  }

  //render (maxPagesShown) pages
  const startPage = maxPageShown * (i - 1) + 1;
  for(let j = startPage; j < startPage + maxPageShown; j++){
    if(j > totalPagesPossible){
      break;
    }

    if(j === parseInt(currentPage)){
      result = result + "<li class=\"page-item active\"><a class=\"page-link\" href=\"javascript:;\">" + j + "</a></li>";
    }
    else{
      result = result + "<li class=\"page-item\"><a class=\"page-link\" href=\"javascript:;\">" + j + "</a></li>";
    }
  }
  return result;
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
