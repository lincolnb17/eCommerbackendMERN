const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const errorMiddleware = require("./middleware/error");
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));
 app.use(cookieParser());

//Route Imports
const food = require("./routes/foodRoute");
const user = require("./routes/userRoute");
const order =require("./routes/orderRoute");

app.use("/api/v1",food);
app.use("/api/v1",user);
app.use("/api/v1",order);

//Middleware for error
app.use(errorMiddleware);
app.use(express.static('public'));

module.exports = app;