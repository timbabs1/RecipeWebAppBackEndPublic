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
                mainImageURL: cnx.request.body.values === undefined ? undefined: cnx.request.body.values.mainImageURL,
                Ending: cnx.request.body.values === undefined ? undefined: cnx.request.body.values.Ending
            };
            try{
                await model.add(recipe)
                console.log('recipe created successfully')
                let data2 = await model.getByTitle(recipe.title)
                
                cnx.response.status = 201;
                cnx.body = {message: "recipe created successfully", recipeData: JSON.stringify(data2[0].ID)};
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
            let recipeName = cnx.request.body === undefined ? undefined: cnx.request.body.recipeName

            try {
                let data = await model.getByTitle(recipeTitle)
                //let id = cnx.params.id
                //let data = await model.getByid(id);


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
module.exports = router;

    