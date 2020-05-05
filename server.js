const express = require('express');  
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'post',
    database : 'facedb'
  }
});

// db.select('*').from('users').then(data => {
// 	console.log(data);
// });

// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


// const database = {
// 	users: [
// 		{
// 			id: '123',
// 			name: 'zoe',
// 			email: 'zoe@zoe.com',
// 			password: 'zoe',
// 			entries: 0,
// 			joined: new Date()
// 		},
// 		{
// 			"id": "124",
//       "name": "sal",
//       "email": "sal@sal.com",
//       "password": "sal",
//       "entries": 0,
// 			joined: new Date()
// 		}
// 	],
// 	login: [
// 		{
// 			id: '987',
// 			hash: '',
// 			email: 'son@son.com'
// 		}
// 	]
// }

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

	// if (req.body.email === database.users[0].email &&
	// 	req.body.password === database.users[0].password) {
	// 	res.json(database.users[0]);
	// } else {
	// 	res.status(400).json('error logging in');
	// };
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			// console.log(isValid);
			if (isValid) {
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						// console.log(user);
						res.json(user[0])
					})
				.catch(err =>res.status(400).json('Unable to get user'))	
			}  else {
				res.status(400).json('Wrong credentials entered')
			}
		})
		.catch(err => res.status(400).json('Wrong credentials entered'))	
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	// let found = false;
	// database.users.forEach(user => {
	// 	if (user.id === id) {
	// 		found = true
	// 		return res.json(user);
	// 	}
	// })
	// updated with below
	db.select('*').from('users').where({id})
		.then(user => {
		// console.log(user[0]);
		if (user.length) {
			res.json(user[0]);
		} else {
			res.status(400).json('no such user');
		}
	})
		.catch(err => res.status(400).json('error getting user'));
	// if (!found) {
	// 	res.status(400).json('no such user');
	// }
})



app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
  // bcrypt.hash(password, null, null, function(err, hash) {
  //   console.log(hash);
  // });

	// database.users.push({
	// 	id: '125',
	// 	name: name,
	// 	email: email,
	// 	password: password,
	// 	entries: 0,
	// 	joined: new Date()
	// })
	// use knex instead of the above
	const hash = bcrypt.hashSync(password);
	// db('users')
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				// email: email,
				email: loginEmail[0],
				name: name,
				joined: new Date()
			})
			.then(
		// console.log
		// response => {
		// 	res.json(response);
		// putting in th [0] makes sure that we return the user object instead of an array.
				user => {
				res.json(user[0]);
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
	})
	.catch(err => res.status(400).json('unable to register'))
	// res.json(database.users[database.users.length-1]);
})


app.put('/image', (req, res) => {
	const { id } = req.body;
	// let found = false;
	// database.users.forEach(user => {
	// 	if (user.id === id) {
	// 		found = true
	// 		user.entries++
	// 		return res.json(user.entries);
	// 	}
	// })
	// if (!found) {
	// 	res.status(400).json('no such user');
	// }
	db('users').where('id', '=', id)
	  .increment('entries', 1)
	  .returning('entries')
	  .then(entries => {
	  	res.json(entries[0]);
	  })
	.catch(err => res.status(400).json('unable to get entries'))
})

app.listen(5000, () => {console.log('everything is running smoothly');})