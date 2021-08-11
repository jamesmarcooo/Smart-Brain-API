const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
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

//cors
app.use(cors());

//setting up body parser for json
app.use(bodyParser.json());


//gets list of users @ route localhost:3000/
// app.get('/', (req, res) => {
//     res.send(database.users);
// })

//Register @ localhost:3000/register
app.post('/register', (req, res) => {
    const { email, name, password } = req.body //destructuring
    const hash = bcrypt.hashSync(password); 

        db.transaction(trx => { //trx will be used instead of db for transaction
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginemail => {
                return trx('users')
                .returning('*')
                .insert({
                    email: loginemail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                res.json(user[0]);
                // res.json(database.users[database.users.length-1]); //response, if not included postman will just load
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })

    // database.users.push({ //template
    //     id: '125',
    //     name: name,
    //     email: email,
    //     entries: 0,
    //     joined: new Date()
    // })
        
    .catch(err => res.status(400).json('unable to register'))
})

//Signing in @ localhost:3000/signin
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if(isValid){
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
                }else{
                    res.status(400).json('wrong credentials')
                }
        })
        .catch(err => res. status(400).json('wrong credentials'))

    // if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
    //     res.json("success")
    // }else{
    //     res.status(400).json('error logging in')
    // }
    // res.json('signing')
})

//gets user profile for homepage @ localhost:3000/profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if(user.length){
                res.json(user[0]);
            }else{
                res.status(400).json('User not found')
            }
        })
    
    
})

//increment the number of entries
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entry count'))
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