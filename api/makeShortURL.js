var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Schemas = require("./schemas/schemas.js");
var mURI = process.env.MONGO_URI;
var MongoClient = mongodb.MongoClient;
var URLModel = mongoose.model("ShortURL", Schemas.URL);
var Settings = mongoose.model("Settings", Schemas.Settings);


mongoose.connect(mURI, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.once("open", function () {
  'use strict';
  console.log("connected!");
});


// let a = new Settings({mostRecentId:0});
// a.save();



var makeNewURL = async function(originalURL){

  let urlObject = {};
  
  await Settings.findById("5eb76748bada310562a2ef28", async function(err, data){
        
    data.mostRecentId++; /*Updated Settings.mostRecentId to keep track of short_url's*/
    data.save(); /*Save the most recent ID*/
    
    urlObject.short_url = data.mostRecentId; /*Assign short URL*/
    urlObject.original_url = originalURL;
    urlObject.urlToVisit = `http://krisb-fcc-url.glitch.me/api/shorturl/${urlObject.short_url}`;

      
    let newURL = new URLModel({
      original_url: originalURL,
      short_url: data.mostRecentId
    })

    newURL.save(function(err, data){
      if (err) console.error(err);
      else console.log("New URL Created");
    });
    
  });
  
  return urlObject;
  
}


exports.create = makeNewURL;
exports.URLModel = URLModel;
exports.settings = Settings;