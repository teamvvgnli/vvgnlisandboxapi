require("dotenv").config({
  path: "./configs/.env",
});

// fundamental imports
const express = require("express"); // express import
const cookieParser = require("cookie-parser"); // cookie parser import
const app = require("express")();

// routes import
const CommonRouter = require("./routes/CommonRouter");
const UserRouter = require("./routes/UserRouter");

// middlewares registration
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes middleware registration
app.use("/api/vvgnli/v1/", CommonRouter);
app.use("/api/vvgnli/v1/user", UserRouter);

app.get("/", (_, res) => {
  res.status(200).json({
    message: "Welcome to Sandbox VVGNLI Backend API with CI/CD",
    status: 200,
    timestamp: Date.now(),
  });
});

app.get("/*", (req, res) => {
  res.status(404).json({
    message: "Requested resource not found",
    status: 404,
    timestamp: Date.now(),
  });
});

module.exports = app;
