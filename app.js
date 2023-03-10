require('dotenv').config();



const express = require('express')

const bodyParser = require('body-parser')
const app = express()
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const port = 3000
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://127.0.0.1:27017/usersDB', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    passwod: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['passwod'] });
const User = new mongoose.model("User", userSchema);


app.get('/', (req, res) => {
    res.render('home')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        passwod: req.body.password
    });
    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets")
        }
    })
});
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;


    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            if (foundUser) {
                if (foundUser.passwod === password) {
                    res.render("secrets")

                } else {
                    res.send("<h1> chutiya samza hai kya</h1>")
                }
            }
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})