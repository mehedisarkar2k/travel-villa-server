const express = require("express");
const app = express();
const cors = require("cors");
// const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

// use middleware
app.use(cors());
app.use(express.json());

// connection URI
// need uri link

// need to create a client

// create a server

app.get("/", (req, res) => {
  console.log("Travel Villa Server is running"); //this log will show on server terminal when client hit get request
  res.send("Travel Villa Server is running"); //this is on client site response
});

app.listen(port, () => {
  console.log(`Travel Villa is running on http://localhost:${port}/`);
});
