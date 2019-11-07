'use strict';

let mysql = require('promise-mysql');
let bcrypt = require('bcrypt');

let info = require('../config');

exports.add = async (user) => {
    try {
        //server validation rules
        //email is required
        if(user.username === undefined){
            throw {message:'username is required', status:400};
        }
        
        //password is required
        if(user.password === undefined){
            throw {message:'password is required', status:400};
        }
        else{
            //if password is provided it must be at least 6 characters long
            if(user.password.length < 6){
                throw {message:'password must be more than 6 characters long', status: 400}
            }
        }
        
        //passwordConfirmation is required
        if(user.passwordConfirmation === undefined)
            throw {message: 'password confirmation is required', status:400};
        else
            //if passwordConfirmation is provided then it must match password
            if(user.password !== user.passwordConfirmation)
                throw {message: 'passwords dont match', status:400};

        //final check is to make sure that username should unique and never been used in the system
        //note that we needed to escape the ' character in order to make the sql statement work
        let sql = `SELECT username from users WHERE username = \'${user.username}\'`;
        
        const connection = await mysql.createConnection(info.config);
        let data = await connection.query(sql);
        
        //if the query returns a record then this has been used before
        if(data.length){
            //first close connection as we are leaving this function
            await connection.end();
            //then throw an error to leave the function
            throw {message: 'username already in use', status:400};
        }

        //hash the password using bcrypjs package
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(user.password, salt);

        //create a new object to hold users final data
        let userData = {
            username: user.username,
            password: hash,
            created: new Date()
        }

        

        //this is the sql statement to execute
        sql = `INSERT INTO users SET ?`;

        
        data = await connection.query(sql, userData);
    
        await connection.end();
        return userData;
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

exports.findOne = async (authData, callback) =>{
    try {
        //first connect to the database
        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
        let sql = `SELECT * FROM users WHERE username = \'${authData.username}\'`;
        //wait for the async code to finish
        let data = await connection.query(sql);

        //wait until connection to db is closed
        await connection.end();

        if(data.length > 0){
            //check if the hashed passwords match
            let pass = bcrypt.compareSync(authData.password, data[0].password)

            if(pass){
                //if yes callback with the user data
                callback(null, data[0]);
                console.log('success') }
            else{
                //otherwise callback with false
                callback(null, false);
                console.log('password failed') }
        }
        else {
            //no such email was found
            callback(null, false);
            console.log('user not found')
        }
        } catch (error) {
            if(error.status === undefined)
                error.status = 500;
            //if an error occurred please log it and throw an exception
            callback(error);
    }
}

exports.getAll = async (page, limit, order)=> {
	try {

        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
		let sql = `SELECT * FROM users
				`;
        let data = await connection.query(sql);
		
		await connection.end();

        return data;

    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

//get an article by its id
exports.getByid = async (id) => {
    try {
        //first connect to the database
        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
        let sql = `SELECT * FROM users WHERE id = ${id}`;

        //wait for the async code to finish
        let data = await connection.query(sql);

        //wait until connection to db is closed
        await connection.end();

        //return the result
        return data;
    } catch (error) {
        //if an error occured please log it and throw an exception
        throw new Error(error)
    }
}