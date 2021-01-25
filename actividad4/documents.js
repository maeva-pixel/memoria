const mongoose = require("mongoose");

//products to add to the almacen
function schema(){
    const schema = new mongoose.Schema({
		cod:{
			type:Number,
			min:0,
			required:[true, "product code required"]
			},
		desc:{
			type:String,
            required:[true, "description required (1 world)"]
			},
		stock:{
			type:Number,
			min:0,
			required:[true, "Stock number required"]
			}
		},
		{collection:"products"},
        {versionKey : false}
	);
 	return mongoose.model('Product', schema);
}

//items to add to the carrito
function schema1(){
    const schema = new mongoose.Schema({
        cod:{
            type:Number,
            min:0,
            required:[true, "product code required"]
            },
        desc:{
            type:String
            }
        },
        {collection:"carrito"}
    );
    return mongoose.model('ProductCarr', schema);
}
    
module.exports = {schema, schema1};
