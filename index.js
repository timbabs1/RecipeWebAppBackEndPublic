//import koa
const koa = require('koa');

//create a koa instance and store it in app variable
const app = new koa();

//import all the routes
const admin = require('./routes/admin');

//apply the routes as middleware
app.use(admin.routes());

//if there is no environment variable set for port number
//ues a default value of 3000
const port = process.env.port || 3000;

//run the server on environment port or port 3000
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});