'use strict';

let mysql = require('promise-mysql');
let bcrypt = require('bcrypt');

let info = require('../config');

exports.add = async (steps) => {
    //console.log(ingredient)
    try {
        console.log(steps.description)
        if(!steps.description){
            throw {message:'title is required', status:400};
        }

        if(!steps.order){
            throw {message:'quantity is required', status:400};
        }

        if(!steps.recipeId){
            throw {message:'recipeId is required', status:400};
        }

        const ok = 'test'

        /* if(!ingredient.mainImageURL){
            throw {message:'mainImage is required', status:400};
        } */

        const stepsData = {
            description : steps.description,
            order : steps.order,
            recipeId : steps.recipeId,
            DateCreated : new Date()
        }
        
        const connection = await mysql.createConnection(info.config);

        let sql = `INSERT INTO steps SET ?`;

        let data = await connection.query(sql, stepsData);

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