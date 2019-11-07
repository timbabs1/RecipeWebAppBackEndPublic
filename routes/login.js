let Router = require('koa-router');
let router = Router({
    prefix: '/api/v1.0/login'
}); //Prefixed all routes with /api/v1.0/articles
let model = require('../models/login');
const passport = require('koa-passport');

//because we are going to parse POST parameters we will import koa-bodyparser
let bodyParser = require('koa-bodyparser'); 

router.post('/', async (cnx) => {
    return passport.authenticate('basic', async (err, user, info, status) => {
        if(err){
            cnx.body = err
            cnx.throw(err.message);
        }
        else if (user === false) {
            cnx.body = { success: false }
            cnx.throw(401)
        } else {
            //let id = cnx.params.id
            let data = user


            if(data.length === 0){
                cnx.response.status = 404;
            }
            else {
                cnx.body = data
                let loginData =  {
                    username: data.username,
                    loginDateTime: new Date()
                }
                model.logAttempt(loginData)
                console.log(data)
            }
        } 
    }) (cnx)
  })

  module.exports = router;