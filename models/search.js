
let mysql = require('promise-mysql');
let bcrypt = require('bcrypt');

let info = require('../config');


    //get an article by its id
exports.getByTitle = async (recipeTitle) => {
    try {
        //first connect to the database

        //this is the sql statement to execute
        const connection = await mysql.createConnection(info.config);

        let sql = `SELECT * FROM recipe WHERE title LIKE \'${recipeTitle}\%'`;

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
        