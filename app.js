var express = require("express");
var seneca = require("seneca")();
var plugin = require("./product-storage.js");
seneca.use(plugin);
seneca.use("seneca-entity");

let getReqCount = 0;
let postReqCount = 0;
seneca.add("role:api, cmd:product", function (args, done) {
    // Post method handler
    if (args.req$.method == "POST") {
        postReqCount++;
        console.log("> products POST: received request")
        var product = {
            product: args.product,
            price: args.price,
            category: args.category,
        };
        seneca.act({
                role: "product",
                cmd: "add",
                data: product
            },
            function (err, msg) {
                console.log("< products POST: sending response")
                done(err, msg);
            }
        );
    }
    // Get method handler
    if (args.req$.method == "GET") {
        getReqCount++;
        console.log("> products GET: received request")
        seneca.act({
            role: "product",
            cmd: "get-all"
        }, function (err, msg) {
            console.log("< products GET: sending response")
            done(err, msg);
        });
    }
    // Delete method handler
    if (args.req$.method == "DELETE") {
        console.log("> products DELETE: received request")
        seneca.act({
            role: "product",
            cmd: "get-all"
        }, function (err, msg) {
            for (const item of msg) {
                seneca.act({
                        role: "product",
                        cmd: "delete",
                        id: item.id
                    },
                    function (err, msg) {}
                );
            }
            console.log("< products DELETE: sending response")
            done(err, {
                message: "Deleted successfully."
            });
        });
    }
    console.log(`Processed Request Count--> Get:${getReqCount}, Post:${postReqCount}`)
    
});

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