const express = require("express");
const app = express();
const api = require("./api/api");

const cors = require("cors");

const mongoose = require("mongoose");

require("dotenv").config();

mongoose
	.connect("mongodb://127.0.0.1:27017/BloggingApp")
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
