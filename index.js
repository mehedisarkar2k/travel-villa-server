const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
// const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
require("dotenv").config();

// use middleware
app.use(cors());
app.use(express.json());

// connection URI
// need uri link
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0ci0a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

// need to create a client
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// create a server
const server = async () => {
  try {
    await client.connect();
    const database = client.db("travelVila");
    const cruiseCollection = database.collection("cruiseCollection");

    app.get("/cruises", async (req, res) => {
      const cursor = cruiseCollection.find({});
      res.json(await cursor.toArray());
    });

    app.get("/cruises/:id", async (req, res) => {
      const result = await cruiseCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });

    console.log("Database Connected");
  } finally {
    // await client.close();
  }
};

server().catch(console.dir);

app.get("/", (req, res) => {
  console.log("Travel Villa Server is running"); //this log will show on server terminal when client hit get request
  res.send("Travel Villa Server is running"); //this is on client site response
});

app.listen(port, () => {
  console.log(`Travel Villa is running on http://localhost:${port}/`);
});
