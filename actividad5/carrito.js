const mg = require('mongodb');
var MongoClient = mg.MongoClient;
var assert = require('assert');
const url = 'mongodb://127.0.0.1/almacen?authSource=admin'

function anadir(producto, client ) {
        //add product to the carrito ;
        console.log("product to add to the carrito "+producto);
        producto1 = {desc:producto}
        MongoClient.connect(url, function(err, db) {
                assert.equal(err, null);
                console.log("connectando");
                var dbo = db.db("almacen");
                var collection = dbo.collection("carrito"+client);
                collection.insertOne(producto1, function(err, res){
                        assert.equal(err, null);
//                      callback(res);
                });
        });
}

function quitar(producto) {
         MongoClient.connect(url, function(err, db) {
                assert.equal(err, null);
                console.log("connectando");
                var dbo = db.db("almacen");
                var collection = dbo.collection("carrito"+client);
                collection.deleteOne({desc:producto1}, function(err, res){
                        if (err) throw err;
                        res.send(obj.result.n+"deleted from the carrito");
                });
        });

}

module.exports = {anadir, quitar};


