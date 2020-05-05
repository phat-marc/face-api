const express = require('express');  
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
// const knex = require('knex');

// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

const database = {
	users: [
		{
			id: '123',
			name: 'zoe',
			email: 'zoe@zoe.com',
			password: 'zoe',
			entries: 0,
			joined: new Date()
		},
		{
			"id": "124",
      "name": "sal",
      "email": "sal@sal.com",
      "password": "sal",
      "entries": 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'son@son.com'
		}
	]
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.send(database.users);})

app.post('/signin', (req, res) => {
	// bcrypt.compare(password, hash, function(err, res) {
	// 	console.log('first guess', res)
	//   // result == true
	// });
	// bcrypt.compare("veggies", hash, function(err, res) {
	// 	console.log('secnd guess', res)
	//   // result == false
	// });
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	};
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true
			return res.json(user);
		}
	})
	if (!found) {
		res.status(400).json('no such user');
	}
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
  // bcrypt.hash(password, null, null, function(err, hash) {
  //   console.log(hash);
  // });
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true
			user.entries++
			return res.json(user.entries);
		}
	})
	if (!found) {
		res.status(400).json('no such user');
	}
})

app.listen(5000, () => {console.log('everything is running smoothly');})