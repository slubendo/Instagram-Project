const fs = require("fs");
const { DEFAULT_HEADER } = require("./util/util");
const path = require("path");
var qs = require("querystring");
const folder = require("../database/data.json")
const { request } = require("http");
const formidable =require("formidable");
const ejs = require('ejs')




const controller = {

// get user page that links to ejs
  getUsersPage: (request, response) => {
    ejs.renderFile(path.join(__dirname, 'views', 'test.ejs'), {

        users : folder

    }, (err, data) => {
        if (err) {
            console.log(err);
        }
        response.write(data);
        response.end();
    })
   
  },
  sendFormData: (request, response) => {
    var body = "";

    request.on("data", function (data) {
      body += data;
    });

    request.on("end", function () {
      var post = qs.parse(body);
      console.log(post);
    });
  },

  // our work for formidable is done in our handler 
  uploadImages: (request, response) => {
    return response.end(``);
  },

// get feed page that links to ejs

  getFeedUser: (request, response) => {
    const { url, method } = request;
    console.log("****")
    // ["/feed?user", "sandra123"]
    const username = url.split("=")[1];

    const user = folder.find(obj => obj.username == username)

    ejs.renderFile(path.join(__dirname, 'views', 'index.ejs'),
    {
        users : user,
        site: url

    }, (err, data) => {
        if (err) {
            console.log(err);
        }
        response.write(data);
        response.end();
    })
   
  },

};


module.exports = controller;