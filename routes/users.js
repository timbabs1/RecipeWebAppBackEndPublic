'use strict'

let Router = require('koa-router');
let router = Router({
    prefix: '/api/v1.0/users'
}); //Prefixed all routes with /api/v1.0/articles
let model = require('../models/users');
const passport = require('koa-passport');

//because we are going to parse POST parameters we will import koa-bodyparser
let bodyParser = require('koa-bodyparser'); 

router.post('/', bodyParser(), async (cnx, next) =>{ 

    //console.log(cnx.request.body);

    //prevent server crash if values is undefined
    let newUser = {
        username : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.username,
        password : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.password,
        passwordConfirmation: cnx.request.body.values === undefined ? undefined: cnx.request.body.values.passwordConfirmation
    };
    try{
        let data = await model.add(newUser) //{message: "user was added successfully"};User
        cnx.body = {message: "user was added successfully", userData: data};
        cnx.response.status = 201;
        console.log('user added successfully')
        console.log(data)
    }
    catch(error){
        cnx.response.status = error.status;
        cnx.body = {message:error.message, status:error.status}
    }

});

router.get('/:id([0-9]{1,})', async (cnx, next) =>{

    //to protect the resource, only authenticated users can access it
    return passport.authenticate('basic', async (err, user, info, status) => {
        if(err){
            cnx.body = err
        }
        else if (user === false) {
            cnx.body = { success: false }
            cnx.throw(401)
        } else {
            //let id = cnx.params.id
            let data = user
            //let data = await model.getByid(id);


            if(data.length === 0){
                cnx.response.status = 404;
                cnx.body = {message:"user not found"}
            }
            else
                cnx.body = data
                console.log(data)
        } 
    }) (cnx)
});

router.get('/', async (cnx) => {
    return passport.authenticate('basic', async (err, user, info, status) => {
        if(err){
            cnx.body = err
        }
        else if (user === false) {
            cnx.body = { success: false }
            cnx.throw(401)
        } else {
            //let id = cnx.params.id
            let data = user
            //let data = await model.getByid(id);


            if(data.length === 0){
                cnx.response.status = 404;
                cnx.body = {message:"user not found"}
            }
            else
                cnx.body = data
        } 
    }) (cnx)
  })

module.exports = router;