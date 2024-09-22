const app = require("./app");
const serverless = require("serverless-http");

require("dotenv").config();
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
const path = require("path");
// const uri = `mongodb+srv://arghadeep:${process.env.DB_PWD}@cluster0.nm8klgn.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb://root:Chicken399@blogging-db-cluster.cluster-cl624q08ms6x.ap-south-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;
const handler = serverless(app);

let dbCertificateObject = {
  importFile: path.join("global-bundle.pem"),
};

// app.listen(3000, () => {
//   console.log("server running");
// });

const port = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await mongoose.connect(uri);
    // console.log("Connected to db");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

module.exports.handler = async (event, context, callback) => {
  await startServer();
  const response = handler(event, context, callback);
  return response;
};
