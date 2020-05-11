/*jshint esversion: 6 */
"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var fetch = require("node-fetch");
var bodyParser = require("body-parser");
var SURL = require("./api/makeShortURL.js");
var cors = require("cors");
var app = express();
var dns = require("dns");
var handlebars = require("express-handlebars").create({
  defaultLayout: false
});

app.use(
  bodyParser.urlencoded({
    extended: "false"
  })
);
app.use(bodyParser.json());

app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine);

// Basic Configuration
var port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/hello", function(request, response) {
  let quote = fetch("https://api.quotable.io/random")
    .then(function(res, rej) {
      return res.json()
    })
    .then(function(data) {
      response.send(data.content);
    });
});

app.get("/test-url", function(req, res) {
  res.render("forwardToUrl", {
    href: req.query.href
  });
});

app.post("/test", function(req, res) {
  console.log(req.body);
});

app.post("/api/shorturl/new", async function(req, res) {
  
  let url = req.body.url, errorMessage = {
      error: "Invalid Input",
      toFix: "URL must begin with 'http' or 'https'"
  }
  
  if (url.indexOf("http" || url.indexOf("https"))) res.json(errorMessage);
  else res.json(await SURL.create(url));
});



app.get("/api/shorturl/:id", function(req, res) {
  SURL.URLModel.find({ short_url: req.params.id }, function(urlError, urlData) {/*use most recent Settings.mostRecentId to find the requested URL*/
    if (urlError) res.json({error: "Invalid Input"});
    else res.render("forwardToUrl", { href: urlData[0].original_url });
  });
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});

console.log(__dirname);
