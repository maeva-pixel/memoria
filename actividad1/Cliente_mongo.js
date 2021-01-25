const mgdb=require('mongodb');
const assert = require('assert');
const mongoclient = mgdb.MongoClient;

var url='mongodb://127.0.0.1/almacen?authSource=admin'
mongoclient.connect(url,function (err,db) {
    assert.equal(err,null);
 	console.log('conectado');
	var dbo = db.db("almacen");
    insertDocuments(db,function() {
    if (err) throw err;
    console.log('success with insertion!');
    db.close();
    });
});

var insertDocuments = function(db, callback) {
    // Get the documents collection
    var dbo = db.db("almacen");
    var collection = dbo.collection('products');
  // Insert some documents
    collection.insertMany([
        {cod : 1,desc:'palos',stock:0}, 
        {cod : 2,desc:'hierros',stock:10}, 
        {cod : 3,desc:'muelles',stock:5}
  ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 products into the collection");
        callback(result);
    });
}
