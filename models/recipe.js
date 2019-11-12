'use strict';

let mysql = require('promise-mysql');
let bcrypt = require('bcrypt');

let info = require('../config');

exports.add = async (recipe) => {
    try {

        if(!recipe.title){
            console.log('no title')
            throw {message:'title is required', status:400};
        }

        let sql0 = `select title from recipe where title = \'${recipe.title}\'`

        const connection = await mysql.createConnection(info.config);

        let data0 = await connection.query(sql0)

        //if the query doesnt return a record then the user doesnt exist
        if(data0.length){
            //first close connection as we are leaving this function
            await connection.end();
            //then throw an error to leave the function
            throw {message: 'A recipe with that title already exist, enter a new title', status:400};
        }


        if(!recipe.Subtitle){
            throw {message:'Subtitle is required', status:400};
        }

        if(!recipe.categoryId){
            throw {message:'category is required', status:400};
        }

        if(!recipe.authorId){
            throw {message:'category is required', status:400};
        }

        //check to make sure user exist in the database for author Id
        let sql1 = `select ID from users where username = \'${recipe.authorId}\'`
        
        let data1 = await connection.query(sql1).then(res => { return JSON.stringify(res[0].ID)});

        //if the query doesnt return a record then the user doesnt exist
        if(!data1.length){
            //first close connection as we are leaving this function
            await connection.end();
            //then throw an error to leave the function
            throw {message: 'user doesnt exist, signup!', status:400};
        }

        //check to make sure user exist in the database for author Id
        let sql2 = `select ID from category where name = \'${recipe.categoryId}\'`

        let data2 = await connection.query(sql2).then(res => { return JSON.stringify(res[0].ID)});

        //console.log(dat

        //let stringify_data2 = JSON.stringify(data2[0].ID)

        //if the query doesnt return a record then the user doesnt exist
        if(!data2.length){
            //first close connection as we are leaving this function
            await connection.end();
            //then throw an error to leave the function
            throw {message: 'category doesnt exist, select a valid category!', status:400};
        }


        let recipeData = {
            title: recipe.title,
            Subtitle: recipe.Subtitle,
            description: recipe.recipeDescription,
            categoryId: data2,
            authorId: data1,
            DateCreated: new Date(),
            DateLastModified: new Date()
        }

        //this is the sql statement to execute
        let sql = `INSERT INTO recipe SET ?`;

        let data = await connection.query(sql, recipeData);

        await connection.end();

        return data;
    } catch (error) {
       //in case we caught an error that has no status defined then this is an error from our database
        //therefore we should set the status code to server error
        if(error.status === undefined){
            error.status = 500;
            throw error;
        }
        throw error
    }
}

//get an article by its id
exports.getByTitle = async (recipeTitle) => {
    try {
        //first connect to the database

        //this is the sql statement to execute
        let sql = `SELECT * FROM recipe WHERE title = \'${recipeTitle}\'`;
        const connection = await mysql.createConnection(info.config);

        //wait for the async code to finish
        let data = await connection.query(sql);

        //wait until connection to db is closed
        await connection.end();

        //return the result
        return data;
    } catch (error) {
        //if an error occured please log it and throw an exception
        if(error.status === undefined){
            error.status = 500;
            throw error;
        }
        throw error
    }
}

