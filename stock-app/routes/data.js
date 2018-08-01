var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var db = require('../config/db');

/* GET Data. */
router.get('/', function(req, res, next) {
    // establish connection to mongoDB
    MongoClient.connect(db.url,(err,database)=>{
        if(err){
            throw err;
        }else{
        // get the right db and collection, then get all the data in json
        let stock = database.db("stock_61f");
        stock.collection("qcom").find().toArray((err,result)=>{
            if (err) { 
                throw err;
            }else{
                // reverse the data to let it display from oldest to latest
                res.json( result[0].data.reverse());
            }
        });
        }
    });
});
  
module.exports = router;
  