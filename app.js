//Basic Settings
const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const key = require('./config/key');
const passport = require('passport');

//Database Settings
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(key.MongoURI,{ useNewUrlParser: true })
.then((db) => {
    console.log('Mongo Connected');
})
.catch(err => {
    console.log(err);
});

//Setting Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Setting up Port
const port = 3000 || process.env.PORT;

//Setting up VIEW Engine
const {select, GenerateTime, paginate} = require('./helpers/handlebars-helpers');

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {select: select,
    GenerateTime: GenerateTime,
    paginate: paginate}, 
    //The first SELECT is the name thats going to be used in handlebars template. It can be anyname
}));
app.set('view engine', 'handlebars');

//Upload Middleware
app.use(upload());

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Method Override
app.use(methodOverride('_method'));

//Session
app.use(session({
    secret: "Hello",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

//Passport
app.use(passport.initialize());
  app.use(passport.session());

//Local Variables using Middleware
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.form_errors = req.flash('form_errors');
    res.locals.error = req.flash('error');
    next();
});

//Importing Routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

//Using Routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);

//Starting a Server
app.listen(port, () => {
    console.log('Server started at ' + port);
});