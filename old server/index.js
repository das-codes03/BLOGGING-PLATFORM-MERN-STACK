const express = require("express");
const app = express();
const api = require("./api/api");
const cors = require("cors");
const ServerlessHttp = require("serverless-http");
const mongoose = require("mongoose");

require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://arghadeep:${process.env.DB_PWD}@cluster0.nm8klgn.mongodb.net/?retryWrites=true&w=majority`;

mongoose
	.connect(uri)
	.then(() => console.log("Connected to DB"))
	.catch((e) => {
		console.log("Connection failed: ", e);
	});

app.use(express.json());
app.use(cors());
app.use("/api", api);

port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

// const handler = ServerlessHttp(api);

// module.exports = handler;
