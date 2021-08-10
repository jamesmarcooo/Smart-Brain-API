const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
//database connect
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'marco',
      database : 'smartbrain'
    }
  });

db.select("*").from('users').then(data => {
    console.log(data);
});

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
    // database.users.push({ //template
    //     id: '125',
    //     name: name,
    //     email: email,
    //     entries: 0,
    //     joined: new Date()
    // })
    db('users').insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(console.log)
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

//gets user profile for homepage @ localhost:3000/profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user); 
        }
    })
    
    if(!found){
        res.status(400).json('not found');
    }
})

//increment the number of entries
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries); 
        }
    })
    if(!found){
        res.status(400).json('not found');
    }
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

//setting of localhost:3000
app.listen(3000, () => {
    console.log('app is running port 3000')
}) 