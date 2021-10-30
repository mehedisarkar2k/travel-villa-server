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
    const orderCollection = database.collection("orderCollection");
    const hotelsCollection = database.collection("hotels");

    // get all data
    app.get("/cruises", async (req, res) => {
      const cursor = cruiseCollection.find({});
      res.json(await cursor.toArray());
    });

    // get all hotels data
    app.get("/hotels", async (req, res) => {
      const cursor = hotelsCollection.find({});
      res.json(await cursor.toArray());
    });

    // get single data with id
    app.get("/cruises/:id", async (req, res) => {
      const result = await cruiseCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });

    // add new order
    app.post("/addOrder", async (req, res) => {
      const orderItem = req.body;
      const result = await orderCollection.insertOne(orderItem);
      res.send(result);
    });

    // get all order
    app.get("/manageOrders", async (req, res) => {
      const cursor = orderCollection.find({});
      res.json(await cursor.toArray());
    });

    // get order for a email
    app.get("/myOrders", async (req, res) => {
      const cursor = orderCollection.find({
        email: req.query.email,
      });
      res.json(await cursor.toArray());
    });

    // delete order for a id
    app.delete("/cancelOrder", async (req, res) => {
      const result = await orderCollection.deleteOne({
        _id: req.query.pdID,
      });

      res.send(result);
      console.log(result);
    });

    // update order for a id
    app.put("/updateOrder", async (req, res) => {
      const filter = { _id: req.query.pdID };
      const data = req.body;
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          status: data.status,
        },
      };

      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // add Package
    app.post("/addPackage", async (req, res) => {
      const data = req.body;
      const result = await cruiseCollection.insertOne(data);

      res.send(result);
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
