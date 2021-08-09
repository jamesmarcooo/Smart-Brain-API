const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');

//setting up express.js
const app = express();

//setting up body parser for json
app.use(bodyParser.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id:'987',
            hash:'',
            email:'john@gmail.com'
        }
    ]
}

//gets list of users @ route localhost:3000/
app.get('/', (req, res) => {
    res.send(database.users);
})

//Register @ localhost:3000/register
app.post('/register', (req, res) => {
    const { email, name, password } = req.body //destructuring
    database.users.push({ //template
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]); //response, if not included postman will just load
})

//Signing in @ localhost:3000/signin
app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json("success")
    }else{
        res.status(400).json('error logging in')
    }
    res.json('signing')
})







//setting of localhost:3000
app.listen(3000, () => {
    console.log('app is running port 3000')
}) 