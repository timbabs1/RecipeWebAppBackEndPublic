exports.addIngredient = async (ingredient) => {
    try {

        if(!ingredient.title){
            throw {message:'title is required', status:400};
        }

        if(!ingredient.quantity){
            throw {message:'Subtitle is required', status:400};
        }

        if(!recipe.categoryId){
            throw {message:'category is required', status:400};
        }

        if(!recipe.mainImageURL){
            throw {message:'category is required', status:400};
        }

        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
        let sql = `INSERT INTO recipe SET ?`;
        let data = await connection.query(sql, recipe);

        console.log(recipe)

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