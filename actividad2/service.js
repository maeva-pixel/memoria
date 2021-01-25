const express = require('express');
const assert = require('assert');
const service = express();
const mgdb = require('mongodb');
const MongoClient = mgdb.MongoClient;
var carr = require('./carrito2.js');
let dbo;
const url='mongodb://127.0.0.1/almacen?authSource=admin';
const bodyParser = require('body-parser');

//connect to mongodb
MongoClient.connect(url, function(err, db) {
	assert.equal(err, null);
 	dbo = db.db("almacen");
});

//setting the headers!!
service.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
  	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	req.headers['content-type'] = 'application/json';
	res.setHeader("Content-Type", "application/json");
	next();
});
service.use(bodyParser.urlencoded({extended : false}));
service.use(bodyParser.json());

//Root status
service.get("/", (req, res) => {
        res.send('<h1>Bienvenido en la API Express del carrito de la compra</h1>');
});
	
/*put some products in the carrito (POST method)
BODY ex : {"desc" : "muelles"}
*/
service.post("/add-product", (req, res, next) => {
	console.log("request is "+req.body);
	carr.comprobarYanadir(req.body.desc.toString());
	res.status(200).json({
		message: 'Done!'
	});
	next();
});

//get all the products availbles en el almacen
service.get('/productos', (req, res, next) => {
    // connect to the mongo db and get the list of the productos
    dbo.collection("products").find().toArray(function(err, result){
	    if (err) throw err;
	    res.status(200).json(result);	
	});	
});

//get all the products in the carrito
service.get('/carrito', (req, res, next) => {
	dbo.collection("carrito").find().toArray(function(err, result){
        if (err) throw err;
		res.status(200).json(result);
        });
});

//remove a product from the carrito
service.post("/rm-product", ( req, res, next) => {
	carr.quitarYupdate(req.body.desc.toString());
	res.send("deleted from carrito");
});

/*add some products to the db
*BODY ex : 
{
"cod" : 7,
"desc" : "pelota",
"stock" : 5
}
*
*will add this new item 
*be careful: different code and desc
*/
service.post("/add-to-db", (req, res, next) => {
	var collection = dbo.collection("products");
	collection.insertOne(req.body)	;
	res.send("add to the database!");
});

/*delete some products from the db
* BODY ex : {"desc" : "muelles"}
*will remove the first item called muelles from the collection products
*/
service.post("/rm-from-db", (req, res, next) => {
	var collection = dbo.collection("products");
	var query = req.body;
	collection.deleteOne(query, function(err, obj) {
		if (err) throw err;
		res.send(obj.result.n + "deleted");
	});
});

/*updating the stock bd. ex of the body :
{
body : {desc:palos},
stock : 2
}
*/
service.post("/update-stock", (req, res, next) => {
	var query = {desc:req.body.desc};
	var newV ={$set : {stock:req.body.stock}};
	var collection = dbo.collection("products");
	collection.updateOne(query,newV, function(err, res){
		if (err) throw err;
		console.log("up to date");
	});
	res.send("up to date");
});

/* 
Same thing but updating the code number 
*/
service.post("/update-code", (req, res, next) => {
        console.log(req.body);
        var query = {desc:req.body.desc};
        var newV ={$set : {cod:req.body.stock}};
        var collection = dbo.collection("products");
        collection.updateOne(query,newV, function(err, res){
                if (err) throw err;
                console.log("up to date");
        });
        res.send("up to date");
});

/*
same thing but updating the description
*/
service.post("/update-name", (req, res, next) => {
        console.log(req.body);
        var query = {desc:req.body.desc};
        var newV ={$set : {desc:req.body.stock}};
        var collection = dbo.collection("products");
        collection.updateOne(query,newV, function(err, res){
                if (err) throw err;
                console.log("up to date");
        });
        res.send("up to date");
});
/*
const port = '8000';
service.set('port', process.env.PORT || 8000);

service.listen(process.env.PORT || 8000, function() {
    console.log('Escuchando peticiones en el puerto '+port);});
*/

module.exports = service;
