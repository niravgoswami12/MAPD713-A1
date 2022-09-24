var express = require("express");
var seneca = require("seneca")();
var plugin = require("./product-storage.js");
seneca.use(plugin);
seneca.use("seneca-entity");

seneca.act("role:web", {
    use: {
        prefix: "/api",
        pin: {
            role: "api",
            cmd: "*"
        },
        map: {
            product: {
                GET: true,
                POST: true,
                DELETE: true
            },
        },
    },
});

var app = express();
app.use(require("body-parser").json());
app.use(seneca.export("web"));
const HOST = "127.0.0.1"
const PORT = 3009;
app.listen(PORT, HOST, function(){

    console.log(`Server listening on ${HOST}:${PORT}`);
    console.log("------------ API Endpoints ------------");
    console.log(`Method: POST -->  http://${HOST}:${PORT}/api/product 
    payload example: {“product”:”Laptop”, “price”:201.99, “category”:”PC”}`);
    console.log(`Method: GET --> http://${HOST}:${PORT}/api/product`);
    console.log(`Method: DELETE --> http://${HOST}:${PORT}/api/product`);

});