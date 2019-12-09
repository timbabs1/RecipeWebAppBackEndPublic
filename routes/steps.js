'use strict'

let Router = require('koa-router');
let router = Router({
    prefix: '/api/v1.0/steps'
}); //Prefixed all routes with /api/v1.0/articles
let model = require('../models/steps');
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
                let steps = cnx.request.body
                for (const i in steps){
                    let data = await model.add(steps[i])
                    cnx.response.status = 201;
                    cnx.body = {message:"steps added successfully"};
                    console.log('steps added successfully')
                }
                console.log(steps)
                
            }
            catch(error){
                cnx.response.status = error.status;
                cnx.body = {message:error.message, status:error.status}
            }
        
        }
    }) (cnx);
})

router.get('/:id([0-9]{1,})', async (cnx) => {
    return passport.authenticate('basic', async (err, user, info, status) => {
        if(err){
            cnx.body = err
        }
        else if (user === false) {
            cnx.body = { success: false }
            cnx.throw(401)
        } else {

            try {
                let recipeId = cnx.params.id
                console.log(recipeId)
                let data = await model.getById(recipeId);


                if(data.length === 0){
                    cnx.response.status = 404;
                    cnx.body = {message:"ingredients not found"}
                }
                else
                    cnx.body = data
                    console.log(data)
                }
            catch(error){
                console.log(error.status)
                if(error.status === undefined){
                    error.status = 500;
                    throw error;
                }
                cnx.response.status = error.status
                cnx.body = {message:error.message, status:error.status}
            }
        } 
    }) (cnx)
  })

  router.put('/:id([0-9]{1,})', bodyParser(), async (cnx, next) => {
    return passport.authenticate('basic', async (err, user, info, status) => {
        if(err){
            cnx.body = err
        }
        else if (user === false) {
            cnx.body = { success: false }
            cnx.throw(401)
        } else {

            try {
                let stepId = cnx.params.id
                console.log(stepId)
                let description = cnx.request.body.values.description
                let order = cnx.request.body.values.order
                let mainImageURL = cnx.request.body.values.imageUrl

                let data = await model.putById(stepId, description, order, mainImageURL); 


                if(data.length === 0){
                    cnx.response.status = 404;
                    cnx.body = {message:"steps not found"}
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
                cnx.response.status = error.status
                cnx.body = {message:error.message, status:error.status}
            }
        } 
    }) (cnx)
  })

  router.delete('/:id([0-9]{1,})', bodyParser(), async (cnx, next) => {
    return passport.authenticate('basic', async (err, user, info, status) => {
        if(err){
            cnx.body = err
        }
        else if (user === false) {
            cnx.body = { success: false }
            cnx.throw(401)
        } else {

            try {
                let stepId = cnx.params.id
                console.log(stepId)
                let data = await model.deleteById(stepId);
                console.log('step deleted successfully')
                if(data.length === 0){
                    cnx.response.status = 404;
                    cnx.body = {message:"step not found"}
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
                cnx.response.status = error.status
                cnx.body = {message:error.message, status:error.status}
            }
        } 
    }) (cnx)
  })

module.exports = router;