const mg = require('mongodb');
const MongoClient = mg.MongoClient;
const assert = require('assert');
const url = 'mongodb://127.0.0.1/almacen?authSource=admin' //to change eventualy 

function anadir(producto) {
        //add product to the carrito ;
        console.log("product to add to the carrito "+producto);
        producto1 = {desc:producto}
        MongoClient.connect(url, function(err, db) {
            assert.equal(err, null);
            console.log("Adding "+producto);
            var dbo = db.db("almacen");
            var collection = dbo.collection("carrito");
            collection.insertOne(producto1, function(err, res){
                assert.equal(err, null);
                console.log(producto+" added");
                });
            db.close()
        });
}

function quitar(producto) {
    //quit product from the carrito
    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        console.log("Quitting "+producto);
        var dbo = db.db("almacen");
        var collection = dbo.collection("carrito");
        collection.deleteOne({desc:producto}, function(err, res){
            if (err) throw err;
                console.log(producto+" deleted from the carrito");
             });
        db.close();
        });

}

module.exports = {anadir, quitar};

//anadir("pelota");
//quitar("pelota");
