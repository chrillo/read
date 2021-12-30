const express = require("express");
const {
  createRequestHandler
} = require("@remix-run/express");

let app = express();

app.use(express.static("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

// needs to handle all verbs (GET, POST, etc.)
app.all(
  "*",
  createRequestHandler({
    // `remix build` and `remix dev` output files to a build directory, you need
    // to pass that build to the request handler
    build: require("./build"),

    // return anything you want here to be available as `context` in your
    // loaders and actions. This is where you can bridge the gap between Remix
    // and your server
    getLoadContext(req, res) {
      return {};
    }
  })
);

const port = process.env.PORT || 3000

setInterval(async function(){
   const res = await fetch(`http://localhost:${port}/cron`)
   const json = await res.json()
   console.log('cron took',json.time)
},5 * 60 * 1000)

app.listen(port)
