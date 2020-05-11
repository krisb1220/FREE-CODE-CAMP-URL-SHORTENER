var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let URLSchema = new Schema({
  original_url: {type:String, required:true},
  short_url: {type:Number, required:true}
});

let Settings = new Schema({
  mostRecentId: Number
});


exports.URL = URLSchema;
exports.Settings = Settings; 