'use strict';

let mysql = require('promise-mysql');
let bcrypt = require('bcrypt');

let info = require('../config');

exports.logAttempt = async (user)=> {
	try {

        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
        let sql = `INSERT INTO login_attempts SET ?`;
        
        let data = await connection.query(sql, user);
		
		await connection.end();

        return data;

    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}