const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const config = require('config.js');

const app = express();

const db = mysql.createConnection(config.db);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
   response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {

   let username = request.body.username;
   let password = request.body.password;
   if (username && password) {
      // Execute SQL query that'll select the account from the database based on the specified username and password
      connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
         // Error output
         if (error) throw error;
         // If the account exists
         if (results.length > 0) {
            request.session.loggedin = true;
            request.session.username = username;
            // Redirect to home page
            response.redirect('/home');
         } else {
            response.send('Incorrect Username and/or Password!');
         }        
         response.end();
      });
   } else {
      response.send('Please enter Username and Password!');
      response.end();
   }
});

app.get('/home', function(request, response) {
   if (request.session.loggedin) {
      response.send('Welcome back, ' + request.session.username + '!');
   } else {
      response.send('Please login to view this page!');
   }
   response.end();
});

app.listen(3000);