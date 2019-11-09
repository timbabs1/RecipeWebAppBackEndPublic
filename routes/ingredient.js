'use strict'

let Router = require('koa-router');
let router = Router({
    prefix: '/api/v1.0/ingredient'
}); //Prefixed all routes with /api/v1.0/articles
let model = require('../models/ingredient');
const passport = require('koa-passport');

//because we are going to parse POST parameters we will import koa-bodyparser
let bodyParser = require('koa-bodyparser');  

router.post('/', bodyParser(), async (cnx, next) =>{ 

    //to protect the resource, only authenticated users can access it
    return passport.authenticate('basic', async (err, user, info, status) => {

        if(err){
            cnx.body = err
        }
        else if (user === false) {
            cnx.body = { success: false }
            cnx.throw(401)
        }
        else {//prevent server crash if values is undefined
            try {
                let ingredient = cnx.request.body
                for (const i in ingredient){
                    let data = await model.add(ingredient[i])
                    cnx.response.status = 201;
                    cnx.body = {message: "ingredient created successfully"};
                    console.log('ingredient added successfully')
                }
                
            }
            catch(error){
                cnx.response.status = error.status;
                cnx.body = {message:error.message, status:error.status}
            }
        
        }
    }) (cnx);
})

module.exports = router;