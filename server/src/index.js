const app = require("./app");

require("dotenv").config();
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://arghadeep:${process.env.DB_PWD}@cluster0.nm8klgn.mongodb.net/?retryWrites=true&w=majority`;

mongoose
	.connect(uri)
	.then(() => console.log("Connected to DB"))
	.catch((e) => {
		console.log("Connection failed: ", e);
	});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	/* eslint-disable no-console */
	console.log(`Listening: http://localhost:${port}`);
	/* eslint-enable no-console */
});
