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

        const stepsData = {
            description : steps.description,
            sort : steps.order,
            recipeId : steps.recipeId,
            mainImageURL: steps.imageUrl,
            DateCreated : new Date()
        }
        
        const connection = await mysql.createConnection(info.config);

        let sql = `INSERT INTO steps SET ?`;

        let data = await connection.query(sql, stepsData);
        await connection.end();
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

exports.getById = async (recipeId) => {
    try {
        const connection = await mysql.createConnection(info.config)

        //this is the sql statement to execute
        let sql = `SELECT * FROM steps WHERE recipeId = \'${recipeId}\'`

        let data = await connection.query(sql);

        await connection.end();

        return data;
    }
    catch (error) {
        //if an error occured please log it and throw an exception
        if(error.status === undefined){
            error.status = 500;
            throw error;
        }
        throw error
    }
}

exports.putById = async (stepId, description, order, mainImageURL) => {
    try {
        const connection = await mysql.createConnection(info.config)

        //this is the sql statement to execute
        let sql = `UPDATE steps SET description = \'${description}\', sort = \'${order}\', mainImageURL = \'${mainImageURL}\' WHERE ID = \'${stepId}\'`

        let data = await connection.query(sql);

        await connection.end();

        return data;
    }
    catch (error) {
        //if an error occured please log it and throw an exception
        if(error.status === undefined){
            error.status = 500;
            throw error;
        }
        throw error
    }
}

exports.deleteById = async (stepId) => {
    try {
        const connection = await mysql.createConnection(info.config)

        //this is the sql statement to execute
        let sql = `DELETE FROM steps WHERE ID = \'${stepId}\'`

        let data = await connection.query(sql);

        await connection.end();

        return data;
    }
    catch (error) {
        //if an error occured please log it and throw an exception
        if(error.status === undefined){
            error.status = 500;
            throw error;
        }
        throw error
    }
}