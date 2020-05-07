const express = require('express');  
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// const db = knex({
//   client: 'pg',
//   connection: {
//     connectionString : process.env.DATABASE_URL,
//     ssl: true
//   }
// });

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'post',
    database : 'facedb'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.send('Woohoo its aliiiiiive!!!');})
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

// Here is two different ways of writing the same thing, remember to check signin.js changes as well
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

// app.listen(process.env.PORT || 5000, () => {console.log(`everything is running smoothly on ${process.env.PORT}`);})
app.listen(5000, () => {console.log('everything is running smoothly on 5000');})