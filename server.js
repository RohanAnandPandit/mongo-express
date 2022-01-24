require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const username = process.env.USER;
const password = process.env.PASSWORD;

const url = `mongodb+srv://${username}:${password}@cluster0.jpzpy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const dbName = "sample_restaurants";

const PORT = process.env || 3000;

let db;
MongoClient.connect(url, async function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db = client.db(dbName);

  app.listen(PORT, () => {
    console.log("Listening...");
  });
});

app.route("/").get(async (req, res) => {
  await db
    .collection("restaurants")
    .find({ name: /^B/ })
    .project({ name: 1, _id: 0 })
    .toArray(async function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});
