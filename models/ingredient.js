'use strict';

let mysql = require('promise-mysql');
let bcrypt = require('bcrypt');

let info = require('../config');

exports.add = async (ingredient) => {
    //console.log(ingredient)
    try {
        console.log(ingredient.name)
        if(!ingredient.name){
            throw {message:'title is required', status:400};
        }

        if(!ingredient.quantity){
            throw {message:'quantity is required', status:400};
        }

        if(!ingredient.categoryId){
            throw {message:'categoryId is required', status:400};
        }

        if(!ingredient.recipeId){
            throw {message:'recipeId is required', status:400};
        }

        const ok = 'test'

        /* if(!ingredient.mainImageURL){
            throw {message:'mainImage is required', status:400};
        } */

        const ingredientData = {
            title : ingredient.name,
            quantity : ingredient.quantity,
            description : ingredient.description,
            categoryId : ingredient.categoryId,
            recipeId : ingredient.recipeId,
            DateCreated : new Date()
        }
        
        const connection = await mysql.createConnection(info.config);

        let sql = `INSERT INTO ingredient SET ?`;

        let data = await connection.query(sql, ingredientData);

        await connection.end();
        console.log(data)
        return data
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
exports.getByTitle = async (ingredientTitle) => {
    try {
        //first connect to the database

        //this is the sql statement to execute
        let sql = `SELECT * FROM ingredient WHERE title = \'${ingredientTitle}\'`;
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