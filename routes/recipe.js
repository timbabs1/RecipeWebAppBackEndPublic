'use strict'

let Router = require('koa-router');
let router = Router({
    prefix: '/api/v1.0/recipe'
}); //Prefixed all routes with /api/v1.0/articles

let model = require('../models/recipe');
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
            let data = user
            let recipe = {
                title : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.title,
                Subtitle : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.subtitle,
                description: cnx.request.body.values === undefined ? undefined: cnx.request.body.values.description,
                categoryId: cnx.request.body.values === undefined ? undefined: cnx.request.body.values.categoryId,
                authorId: data.username === undefined ? undefined: data.username,
                mainImageURL: cnx.request.body.values === undefined ? undefined: cnx.request.body.values.profilePhoto,
                Ending: cnx.request.body.values === undefined ? undefined: cnx.request.body.values.Ending
            };
            try{
                console.log(recipe)
                await model.add(recipe)
                console.log('recipe created successfully')
                let data2 = await model.getByTitle(recipe.title)
                
                cnx.response.status = 201;
                cnx.body = {message: "recipe created successfully", recipeId: JSON.stringify(data2[0].ID), categoryId: JSON.stringify(data2[0].categoryId)};
                return data2;
            }
            catch(error){
                cnx.response.status = error.status;
                cnx.body = {message:error.message, status:error.status}
            }
        
        }
    }) (cnx);
})

router.get('/', async (cnx) => {
    return passport.authenticate('basic', async (err, user, info, status) => {
        if(err){
            cnx.body = err
        }
        else if (user === false) {
            cnx.body = { success: false }
            cnx.throw(401)
        } else {

            try {
                let limit = (cnx.request.query.limit === undefined ? 32:cnx.request.query.limit);
                console.log(limit)
                let page = (cnx.request.query.page === undefined ? 1:cnx.request.query.page);
                //validate the query parameters
                limit = limit > 200 ? 200: limit; 
                limit = limit < 1 ? 32: limit; 
                page = page < 1 ? 1 : page; 
                let data = await model.getAll(user.ID, page, limit)
                if(data.length === 0){
                    let data2 = [{ ID: 2,
                        title: 'My new Recipe 1',
                        subtitle: 'New Recipe Subtitle 1269',
                        description: null,
                        categoryId: 2,
                        mainImageURL: null,
                        Ending: null,
                        authorId: 1 }]
                    /* cnx.response.status = 404; */
                    cnx.body = data2
                    console.log(data2)
                }
                else
                    cnx.body = data
                }
            catch(error){
                cnx.response.status = error.status;
                cnx.body = {message:error.message, status:error.status}
            }
        } 
    }) (cnx)
  })

  router.get('/category', async (cnx) => {
    return passport.authenticate('basic', async (err, user, info, status) => {
        if(err){
            cnx.body = err
        }
        else if (user === false) {
            cnx.body = { success: false }
            cnx.throw(401)
        } else {

            try {
                let category = cnx.request.query.category
                let limit = (cnx.request.query.limit === undefined ? 32:cnx.request.query.limit);
                console.log(limit)
                let page = (cnx.request.query.page === undefined ? 1:cnx.request.query.page);
                //validate the query parameters
                limit = limit > 200 ? 200: limit; 
                limit = limit < 1 ? 32: limit; 
                page = page < 1 ? 1 : page; 
                let data = await model.getByCategory(category)
                if(data.length === 0){
                    cnx.response.status = 404;
                    cnx.body = {message:"recipe not found"}
                }
                else
                    cnx.body = data
                }
            catch(error){
                cnx.response.status = error.status;
                cnx.body = {message:error.message, status:error.status}
            }
        } 
    }) (cnx)
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
                let limit = (cnx.params.limit === undefined ? 32:cnx.params.limit);
                limit = limit > 200 ? 200: limit; 
                /* console.log(limit) */
                let recipeId = cnx.params.id
                console.log(recipeId)
                let data = await model.getById(recipeId);


                if(data.length === 0){
                    cnx.response.status = 404;
                    cnx.body = {message:"recipe not found"}
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
                let recipeId = cnx.params.id
                console.log(recipeId)
                let title = cnx.request.body.values.title
                let description = cnx.request.body.values.description
                let subtitle = cnx.request.body.values.subtitle
                let categoryId = cnx.request.body.values.categoryId
                let mainImageURL = cnx.request.body.values.recipePhoto
                let data = await model.putById(recipeId, title, description, subtitle, categoryId, mainImageURL); 


                if(data.length === 0){
                    cnx.response.status = 404;
                    cnx.body = {message:"recipe not found"}
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
                let recipeId = cnx.params.id
                console.log(recipeId)
                let data = await model.deleteById(recipeId);
                console.log('ingredient deleted successfully')
                if(data.length === 0){
                    cnx.response.status = 404;
                    cnx.body = {message:"recipe not found"}
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


    