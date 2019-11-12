const mysql = require('promise-mysql');
const info = require('../config');

exports.createTables = async (id)=> {
    try {
        const connection = await mysql.createConnection(info.config);

        //let sql2 = `CREATE DATABASE recipe_composer`;

        //await connection.query(sql2)

        //this is the sql statement to execute
        let sql = `CREATE TABLE Recipe (
                    ID INT NOT NULL AUTO_INCREMENT,
                    title VARCHAR(32),
                    Subtitle TEXT,
                    description TEXT,
                    categoryId INT,
                    DateCreated DATETIME,
                    DateLastModified DATETIME,
                    mainImageURL TEXT,
                    Ending TEXT,
                    PRIMARY KEY (ID)
        )`;
        await connection.query(sql);

        sql = `CREATE TABLE Ingredient (
              ID INT NOT NULL AUTO_INCREMENT,
              title TEXT,
              quatity INT,
              description TEXT,
              DateCreated DATETIME,
              mainImageURL TEXT,
              PRIMARY KEY (ID)
        )`;
        await connection.query(sql);

        sql = `CREATE TABLE Users (
            ID INT NOT NULL AUTO_INCREMENT,
            username TEXT,
            password VARCHAR(16),
            pwd VARCHAR(256),
            pwdSalt VARCHAR(32),
            created DATETIME,
            PRIMARY KEY (ID)
        )`;
        await connection.query(sql);

        sql = `CREATE TABLE steps (
            ID INT NOT NULL AUTO_INCREMENT,
            description TEXT,
            orders INT,
            DateCreated DATETIME,
            mainImageurl TEXT,
            PRIMARY KEY (ID)
        )`;
        await connection.query(sql);

        sql = `CREATE TABLE recipeImages (
            ID INT NOT NULL AUTO_INCREMENT,
            url TEXT,
            DateCreated DATETIME,
            deleted bool,
            PRIMARY KEY (ID)
        )`;
        await connection.query(sql);

        sql = `CREATE TABLE stepsImages (
            ID INT NOT NULL AUTO_INCREMENT,
            url TEXT,
            Orders INT,
            DateCreated DATETIME,
            deleted bool,
            PRIMARY KEY (ID)
        )`;
        await connection.query(sql);

        sql = `CREATE TABLE QuatityUnit (
            ID INT NOT NULL AUTO_INCREMENT,
            name TEXT,
            PRIMARY KEY (ID)
        )`;
        await connection.query(sql);

        sql = `CREATE TABLE Category (
            ID INT NOT NULL AUTO_INCREMENT,
            name TEXT,
            Description TEXT,
            imageURL TEXT,
            PRIMARY KEY (ID)
        )`;
        await connection.query(sql);

        return {message:"created successfully"};
    } catch (error) {
        console.log(error);
        ctx.throw(500, 'An Error has occurred')
    }
}