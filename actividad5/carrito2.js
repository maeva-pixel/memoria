var mgdb = require('mongodb');
var MongoClient = mgdb.MongoClient;
var assert = require('assert');
var carrBasico = require('./carrito.js');
let dbo;
var url = 'mongodb://127.0.0.1/almacen?authSource=admin'

MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        console.log('connectado');
        dbo = db.db("almacen");
}
);
//verifier que le produit existe et qu'il es disponible 
//modifier la base de données 

function quitarYupdate(producto, client, collectionExist){
	console.log("removing" + producto + "of the shopping cart");
    const collName = "carrito".concat(client);
	var pro = new Promise( (resolve, reject) => {
        if (!collectionExist){
            dbo.createCollection(collName, function(err, res){console.log("Done creating "+collName);});
        }
     resolve(collName);}
)
.then( (collName) => {
        console.log(collName);
        var query = {desc:producto};
		console.log("query is "+query);
		collection = dbo.collection(collName);
		collection.findOne(query, function(err, result){
			if (err) throw err;
			if (JSON.stringify(result) == undefined || JSON.stringify(result) =='null') console.log("The product is not in the cart");
			else{//product is in the cart
				collection.deleteOne({desc:producto}, function(err, obj){
					if (err) throw err;
					else console.log("doneeee");
				});
            }
        });
        resolve(1);
})
.then( (val) => {
		dbo.collecion("products").findOne({desc:producto}, function(err, res){
            var result1 = JSON.stringify(res);
            var stk = JSON.parse(result1)["stock"];
            console.log("stk is "+stk);
            resolve(stk);
        });
})
.then( (stk) => {
    	var newvalue = {$set: {stock : stk +1 }};
        dbo.collection("products").updateOne({desc:producto}, newvalue, function(err, res) {
            if (err) throw err;
                console.log("product update");
                });
			});
}

function comprobarYanadir(producto, client, collectionExist){
    console.log(collectionExist);
    const pro = new Promise((resolve, reject) => {
        console.log(producto);
  //    console.log("query is "+JSON.stringify(query));
        resolve(1);
})
.then(
    () => {
       if (!collectionExist){
            const collName = "carrito".concat(client);
            dbo.createCollection(collName, function(err, res){console.log("Done creating "+collName);});
        } 
        return(1); 
    } 
)	
.then(
	() => {
        var query = {desc : producto};
        dbo.collection("products").findOne(query, function(err, result){ 
		    if (err) throw err;
		    console.log("query result: "+ JSON.stringify(result));
		    if (JSON.stringify(result) == undefined || JSON.stringify(result) == 'null') console.log("I'm sorry this product does not exist!");
			else{
				var result1 = JSON.stringify(result);
				var stk = JSON.parse(result1)["stock"];
			//	console.log("stk is "+stk);
				if (stk == 0) console.log("Sorry this product is not avaible anymore");
				if (stk > 0) {
					carrBasico.anadir(producto, client.toString());
					console.log("done adding the product!");
					//chage the stock number on mongodb
					var newvalue = {$set: {stock : stk -1 }};
                    dbo.collection("products").updateOne(query, newvalue, function(err, res) {
						if (err) throw err;
						console.log("product stock update");	
					});
				}
			}
	//		db.close();
		});
	}
);

}

module.exports = {comprobarYanadir, quitarYupdate}

