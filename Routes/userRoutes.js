const express = require("express");
const app = express(); // Use express.Router() instead of express()

const controllers = require('../controllers/userControllers');
const auth = require('../middleware/auth');
const olduserauth = require('../middleware/olduserauth');



// Middleware to parse JSON bodies
app.get("/", olduserauth,(req, res) => {
    console.log('rendering the home page')
    res.render("home");
});
app.get("/login", (req, res) => {
    console.log('rendering the login page')
    res.render("login");
});
app.post('/register', controllers.Student_register);
app.post('/login_Student', controllers.Student_login )

app.get('/myprofile' , auth ,(req, res) => {
    res.render('profile', { student: req.student })
    student = req.student
    console.log(student);
} )
app.get('/logout' , auth ,controllers.Student_logout)


module.exports = app;
