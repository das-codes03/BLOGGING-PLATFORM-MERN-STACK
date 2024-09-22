const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

const bufferToJSONMiddleware = (req, res, next) => {
  if (req.body && req.body instanceof Buffer) {
    try {
      req.body = JSON.parse(req.body.toString());
    } catch (err) {
      // return res
      //   .status(400)
      //   .json({
      //     error: "Invalid JSON data",
      //     data: JSON.stringify(err),
      //     payload: JSON.stringify(req.body),
      //   });
    }
  }

  next();
};

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(bufferToJSONMiddleware);

const connection = null;

let invocationNumber = 1;
app.get("/", (req, res) => {
  invocationNumber++;
  return res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
    invocationNumber,
  });
});

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
