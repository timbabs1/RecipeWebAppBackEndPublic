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
                console.log(ingredient)
                for (const i in ingredient){
                    let data = await model.add(ingredient[i])
                    cnx.response.status = 201;
                    cnx.body = {message: "ingredient created successfully", recipeId: ingredient[0].recipeId, categoryId: ingredient[0].categoryId};
                
                    console.log('ingredient added successfully')
                }
                
                /* cnx.response.status = 201;
                cnx.body = {message: "ingredient created successfully", recipeId: JSON.stringify(data2[0].ID), categoryId: JSON.stringify(data2[0].categoryId)}; */
                
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
                let ingredientId = cnx.params.id
                console.log(ingredientId)
                let title = cnx.request.body.values.title
                let description = cnx.request.body.values.description
                let quantity = cnx.request.body.values.quantity
                let mainImageURL = cnx.request.body.values.imageUrl
                let data = await model.putById(ingredientId, title, description, quantity, mainImageURL); 


                if(data.length === 0){
                    cnx.response.status = 404;
                    cnx.body = {message:"ingredients not found"}
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
                let ingredientId = cnx.params.id
                console.log(ingredientId)
                let data = await model.deleteById(ingredientId);
                console.log('ingredient deleted successfully')
                if(data.length === 0){
                    cnx.response.status = 404;
                    cnx.body = {message:"ingredients not found"}
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