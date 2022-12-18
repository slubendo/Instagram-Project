const { parse } = require("url");
const { DEFAULT_HEADER } = require("./util/util.js");
const controller = require("./controller");
const { createReadStream } = require("fs");
const path = require("path");
const { request } = require("http");
const { getUsersPage } = require("./controller");
const formidable = require('formidable');
const { url } = require("inspector");


//* ROUTES  ARE URL
//* WE HAVE TO CREATE A "/":GET

const allRoutes = {

// logo image
"/src/photos/logo.png:get": (request, response) => {
  createReadStream("./src/photos/logo.png").pipe(response)
  },

//Images of John
  "/src/photos/john123/profile.jpeg:get": (request, response) => {
createReadStream(__dirname + "/photos/john123/profile.jpeg").pipe(response)
  },

"/src/photos/john123/pic1.png:get": (request, response) => {
createReadStream(__dirname + "/photos/john123/pic1.png").pipe(response)
  },
    
  "/src/photos/john123/pic2.png:get": (request, response) => {
  createReadStream(__dirname + "/photos/john123/pic2.png").pipe(response)
  },

//Images of Sandra
  "/src/photos/sandra123/profile.jpeg:get": (request, response) => {
    createReadStream(__dirname + "/photos/sandra123/profile.jpeg").pipe(response)
      },
    
  "/src/photos/sandra123/pic1.png:get": (request, response) => {
  createReadStream(__dirname + "/photos/sandra123/pic1.png").pipe(response)
    },
      
    "/src/photos/sandra123/pic2.png:get": (request, response) => {
    createReadStream(__dirname + "/photos/sandra123/pic2.png").pipe(response)
    },
  
  // GET: localhost:3000/form
   "/:get": (request, response) => {
   controller.getUsersPage(request, response);
  },

  // GET: localhost:3000/feed
  // Shows instagram profile for a given user
  "/feed:get": (request, response) => {
    controller.getFeedUser(request, response);
  },


  // GET: localhost:3000/form
  "/form:get": (request, response) => {
    controller.getFormPage(request, response);
  },
  // POST: localhost:3000/form
  "/form:post": (request, response) => {
    controller.sendFormData(request, response);
  },
  // POST: localhost:3000/images
  "/images:post": (request, response) => {
    controller.uploadImages(request, response);
  },

  // Our work for formidable is here
  // formidable works nd is running however cant figure out a way to load pictures from folders. Everything else good

  uploadImages: (request,response) =>{
    const url =request.url;// /images?username=john123
    const form =formidable ({
      multiples:true,
      uploadDir:`${__dirname}/photos`,
      keepExtensions: true,
    });
    form.parse(request,async(err,fields,files)=>{
      if(err) { 
        response.writeHead(err.httpCode ||400, {
          "Content-Type":"text/pain",
        });
        console.log(files);
        response.end(String(err))
        return
      }
      await fs.rename(files.upload.originalFilePath,).catch()
      response.writeHead(200,{  "Content-Type": "application.json"})
      response.end(JSON.stringify({fields,files},null,2));
    });
    return
    },


  // 404 routes
  default: (request, response) => {
    response.writeHead(404, DEFAULT_HEADER);
    createReadStream(path.join(__dirname, "views", "404.html"), "utf8").pipe(
      response
    );
  },
};

function handler(request, response) {
  const { url, method } = request;

  const { pathname } = parse(url, true);

  const key = `${pathname}:${method.toLowerCase()}`;
  const chosen = allRoutes[key] || allRoutes.default;

  return Promise.resolve(chosen(request, response)).catch(
    handlerError(response)
  );
}

function handlerError(response) {
  return (error) => {
    console.log("Something bad has  happened**", error.stack);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(
      JSON.stringify({
        error: "internet server error!!",
      })
    );

    return response.end();
  };
}

module.exports = handler;
