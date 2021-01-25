//modulo de comprobacion de los stocks

const mgdb = require('mongodb');
const MongoClient = mgdb.MongoClient;
const assert = require('assert');
const carrBasico = require('./carrito.js');

const url = 'mongodb://127.0.0.1/almacen?authSource=admin'

/**
*check if the product you want to add is avaible and update the stock if yes
**/

function comprobarYanadir(producto){
	MongoClient.connect(url, function (err, db) {
		assert.equal(err, null);
		var dbo = db.db("almacen");
		var query = {desc : producto};
		dbo.collection("products").findOne(query, function(err, result){ 
			if (err) throw err;
			if (JSON.stringify(result) == undefined || JSON.stringify(result) == 'null') console.log("I'm sorry this product does not exist!");
			else{
				var result1 = JSON.stringify(result);
				var stk = JSON.parse(result1)["stock"];
				if (stk == 0) {
                    console.log("Sorry this product is not avaible anymore");
                    db.close();
                    }
				if (stk > 0) {
					carrBasico.anadir(producto);
					//chage the stock number on mongodb
					var newvalue = {$set: {stock : stk -1 }};
					dbo.collection("products").updateOne(query, newvalue, function(err, res) {
						if (err) throw err;
						console.log("product stock update");	
                        db.close();
					});
				}
			}
		});
	});

}

/*
*check if the product is in the shopping cart first. If yes 
*it remove it and it update the stock 
*/

function quitarYupdate(producto){
	MongoClient.connect(url, function(err, db) {
		assert.equal(err, null);
        console.log("Deleting "+producto);
		var dbo = db.db("almacen");
		var query = {desc:producto};
		collection = dbo.collection("carrito");
		collection.findOne(query, function(err, result){
			if (err) throw err;
			if (JSON.stringify(result) == undefined || JSON.stringify(result) =='null') {
                console.log("The product is not in the cart");
                db.close();
                }
			else{
				//product is in the cart
				collection.deleteOne({desc:producto}, function(err, obj){
					if (err) throw err;
					else console.log("Done deleting "+producto);
				});
                dbo.collection("products").findOne(query, function(err, ress){
 			 	    var result1 = JSON.stringify(ress);
                    var stk = JSON.parse(result1)["stock"];
                    var newvalue = {$set: {stock : stk +1 }};
                    dbo.collection("products").updateOne(query, newvalue, function(err, res) {
                        if (err) throw err;
                        console.log("product update");
                        db.close();
                        });
                    });
			}
        });
    });

}

module.exports = {comprobarYanadir, quitarYupdate}
//comprobarYanadir("hierros");
//quitarYupdate("hierros");
