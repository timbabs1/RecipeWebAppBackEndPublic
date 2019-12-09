'use strict'

let Router = require('koa-router');
let router = Router({
    prefix: '/api/v1.0/recent'
}); //Prefixed all routes with /api/v1.0/articles
let model = require('../models/recentlyAdded.js');
const passport = require('koa-passport');

//because we are going to parse POST parameters we will import koa-bodyparser
let bodyParser = require('koa-bodyparser'); 


router.get('/:title', async (cnx, next) =>{ 

    //to protect the resource, only authenticated users can access it
    return passport.authenticate('basic', async (err, user, info, status) => {


        if(err){
            cnx.body = err
        }
        else if (user === false) {
            cnx.body = { success: false }
            cnx.throw(401)
        } else {
            try {
                let search = cnx.params.title

                let data = await model.getByTitle(search)

                if(data.length === 0 ){
                    cnx.response.status = 404;
                    cnx.body = {message:'recipe not found'}
                }
                else
                    cnx.body = data
                
            }
            catch(error){
                console.log(error.status)
                console.log(error.message)
                if(error.status === undefined){
                    error.status = 500;
                    throw error;
                }
                cnx.response.status = error.status;
                cnx.body = {message:error.message, status:error.status}
            }
        
        }
    }) (cnx);
})

module.exports = router