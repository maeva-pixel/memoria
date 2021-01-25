const express = require('express');
const Promise = require("bluebird");
const assert = require('assert');
const service = express();
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1/almacen?authSource=admin';
const bodyParser = require('body-parser');
const doc = require('./documents.js');
const Product = doc.schema()
const ProductCarr = doc.schema1()

//connection
mongoose.connect(url).then(function(db) {
    console.log("connectando");
});

//set the headers
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

//root middleware
service.get("/", (req, res) => {
    new Promise( function(resolve, reject) {
        if (res.statusCode == 200){
    	    res.send('<h1>Bienvenido en la API Express del carrito de compra</h1>');
            resolve("Done!");
            }
        else reject("Error can't do the get request");                           
    })
.then(function(value){console.log(value);},
        function(error){console.log(error);});
});

//POST middleware to put a product in the carrito
service.post('/add-product', (req, ress, next) => {
    new Promise( function(resolve, reject) {
        resolve(req.body.desc)
        })
.then( //find the product in the products db
    res => {    
        console.log("trying to add "+res+" at the carrito db");
        return (Product.findOne({desc:res}).lean());
        },
    err => {ress.send("Something is wrong")}
    )
.then( //find the stock in the products db and update it
    res => {
            if (res == "undefined" || res == null){    
                return (("This product doesn't exist"));
            }
            var prod  = JSON.parse(JSON.stringify(res));
            console.log(prod);
            var stk = prod["stock"];
            if (stk == 0 ) return("This product is not avaible");
            else{
                stk = stk - 1;
                return(Product.findOneAndUpdate({desc:prod["desc"]}, {stock:stk}, function(err, res){
                console.log("updating "+res);
                })
                );
            }
    }
)
.then( //add the same product to the carrito db
    res => {
        if (res.desc != undefined){
            ress.send(res.desc+" added to the carrito");
            var prod = new ProductCarr({cod:res.cod, desc:res.desc});
            return (prod.save())
            }
        else ress.send(res);
    }
)
.catch( err => {
    console.log(err.stack)
    }
)
;
});

//get all the products avaibles
service.get("/productos", (req, res, next) => {
    new Promise( function(resolve, reject){
        if (res.statusCode == 200) resolve() 
    })
.then(
    resolve => {return(Product.find({}).lean())}
)
.then(
    resolve => {res.send(resolve)}
)
.catch( err => {
    console.log(err.stack)
        }
    );
});

//get all the products in the carrito
service.get("/carrito", (req, res, next) => {
    new Promise( function(resolve, reject){
        if (res.statusCode == 200) resolve()
    })
.then(
    resolve => {return(ProductCarr.find({}).lean())}
)
.then(
    resolve => {res.send(resolve)}
)
});

//remove a product from the carrito
// request body ex : {"desc":"hierros"}
service.post("/remCarr", (req, res, next) => {
    new Promise(function(resolve, reject){
        if (res.statusCode ==200) resolve(req.body.desc)
        else reject(); 
    })
.then( //delete from the collection carrito
    resolve => {return(ProductCarr.deleteOne({desc:resolve}))}
)
.then(
    resolve => {
        if (resolve.deletedCount == 1) {
            res.send(req.body.desc+" deleted!")
            return(req.body.desc);
        }
        else {
            res.send("the product was not in the cart");
            return (null);
            }
    })
.then(
    resolve => {
        if (resolve != null){
            return(Product.findOne({desc:resolve}).lean());
        }
    })
.then(
    res => {
        if (res != null){
        var prod  = JSON.parse(JSON.stringify(res));
        console.log(prod);
        var stk = prod["stock"];
        stk = stk + 1;
        return(Product.findOneAndUpdate({desc:prod["desc"]}, {stock:stk}, function(err, res){
            console.log("updating "+res);
            })
            );
        }
    })
.catch( err => {
    console.log(err.stack)
    }
)
;
});

//remove from the database products
// request body ex : {"desc":"hierros"}
service.post("/rem", (req, res, next) => {
    new Promise(function(resolve, reject){
        if (res.statusCode ==200) resolve(req.body)
        else reject();
    })
.then(
    resolve => {return(Product.deleteOne(resolve))}
)
.then(
    resolve => {
        if (resolve.deletedCount == 1) res.send(req.body.desc+" deleted!")
        else res.send("the product was not in the db")
    })
.catch( err => {
    console.log(err.stack)
    }
)
;
});

//add a product in the db products:
/* request exemple
{
"cod" : 4,
"desc":"ordenador",
"stock" : 6
}
*/
service.post("/add", (req, res, next) => {
    new Promise(function(resolve, reject) {
        if (res.statusCode == 200) resolve(req.body)
        else reject();
    })
.then(
    resolve => {
            var prod = new Product(resolve);
            return (prod.save());
        }
)
.then(
    resolve => {res.send(""+resolve.desc+" added!")}
)
.catch(err => {console.log(err.stack)});
});

const port = '8000';
service.set('port', process.env.PORT || 8000);
service.listen(process.env.PORT || 8000, function() {
console.log('Escuchando peticiones en el puerto '+port);});

