
 var mgdb=require('mongodb');
 var assert = require('assert');

  var mongoclient = mgdb.MongoClient;

var url='mongodb://127.0.0.1/almacen?authSource=admin'
// //localhost:8100
 mongoclient.connect(url,function (err,db) {
 	assert.equal(err,null);
 	console.log('conectado');
	var dbo = db.db("almacen");
	var ex = 0;// collection doesn't exist	
	//check if the collection exist
	dbo.collections(function(e, cols) {
		cols.forEach(function(col) {
			console.log(col.collectionName);
			if (col.collectionName == "documents" || col.collectionName == "products" || col.collectionName == "system.indexes") ex == 1;
		});
	}); 
	//devrait etre ex = 0 je ne comprend pas pourquoi ça ne marche pas
	if (ex == 1) dbo.createCollection("documents", function(err, res) {
    	if (err) throw err;
    	console.log("Collection created!");
  	});
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
    {cod : 1,desc:'palos',stock:0}, {cod : 2,desc:'hierros',stock:10}, {cod : 3,desc:'muelles',stock:5}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 products into the collection");
    callback(result);
  });
}
