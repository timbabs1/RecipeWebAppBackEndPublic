//import koa
const koa = require('koa');
const multer = require('@koa/multer')
const passport = require('koa-passport');

require('./auth');

//create a koa instance and store it in app variable
const app = new koa();

const cors = require('@koa/cors');
app.use(cors());

//import all the routes
const admin = require('./routes/admin');
const users = require('./routes/users');
const login = require('./routes/login');
const recipe = require('./routes/recipe');
const ingredient = require('./routes/ingredient');
const steps = require('./routes/steps');
const search = require('./routes/search');
const recent = require('./routes/recentlyAdded.js');

//apply the routes as middleware
app.use(admin.routes());
app.use(users.routes());
app.use(login.routes());
app.use(recipe.routes());
app.use(ingredient.routes());
app.use(steps.routes());
app.use(passport.initialize());
app.use(search.routes());
app.use(recent.routes());

//if there is no environment variable set for port number
//ues a default value of 3000
const port = process.env.port || 3000;

//run the server on environment port or port 3000
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});