const express = require('express');
const routes = require('./Routes/userRoutes')
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');

require('dotenv').config();


require('dotenv').config();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/public', express.static(path.join(__dirname, 'public')));
const port = process.env.PORT  ||3000;
mongoose.connect(process.env.MONGODB_URL)
console.log('Database connected successfully')
app.set("view engine", "ejs");


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use("/", routes)
// app.get("/api", routes)

