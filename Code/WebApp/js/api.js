const express = require("express");
const mysql = require("mysql2");
const dbconfig = require("C:/xampp/htdocs/e-ethelodria/config.json");
const session = require("express-session");
const path = require("path"); 
//const bcrypt = require("bcrypt");
const exphbs = require("express-handlebars");

const app = express();

const db = mysql.createConnection({
  host: dbconfig.db.host,
  user: dbconfig.db.user,
  password: dbconfig.db.password,
  database: dbconfig.db.database
});

db.connect( (error) => {
   if(error) {
      console.log("Error connecting to MySQL", error);
      process.exit(1); 
   } else {
      console.log("MySQL Connected...");
   } 
});

/*
// Configure Handlebars
app.engine('html', exphbs.create({
  extname: '.html', // Set the file extension to .html
}));
app.set('view engine', 'html');
app.engine('html', hbs.engine);

// Set the views directory to the folder where your HTML files are located
app.set('views', path.join(__dirname, '/views'));
*/
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

app.post('/login', function(request, response, next) {

   var username = request.body.username;
   var password = request.body.password;
   //console.log(username);
   //console.log(password);

   if (username && password) {
      // Execute SQL query that'll select the account from the database based on the specified username and password
      query = 'SELECT * FROM user WHERE username = ? AND password = ?';
      db.query(query, function(error, data) {
         // If the account exists
         if (data.length > 0) {

            for (var count = 0; count < data.length; count++) {
               
               if(data[count].password == password) {
                  request.session.username = data[count].username;
                  response.redirect("/user_home.html");
               }
               else { 
                  response.send('Incorrect Password');

               }
            }

         } else {
            response.send('Incorrect Username and/or Password!');
            response.end();
         }        
     
      });
   } else {
      response.send('Please enter Username and Password!');
      response.end();
   }
});

app.get('/logout', function(requst, response, next) {
   request.session.destroy();

   response.redirect("/user_home.html");
});

app.listen(3000, () => {
   console.log("Server started on port 3000");
});