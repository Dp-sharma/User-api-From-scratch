const express = require('express');
const routes = require('./Routes/userRoutes')
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');




require('dotenv').config();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/public', express.static(path.join(__dirname, 'public')));
const port = 3000
mongoose.connect("mongodb://127.0.0.1:27017/Mock_test_api")
console.log('Database connected successfully')
app.set("view engine", "ejs");


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use("/", routes)
// app.get("/api", routes)

