const express = require("express");
const mysql = require("mysql2");
const dbconfig = require("C:/xampp/htdocs/e-ethelodria/config.json");
const session = require("express-session");
const path = require("path"); 

const app = express();

//Connect to MySQL Database
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

//Creating sessions 
app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
   //Render login form
   response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {

   //Capture input fields
   let username = request.body.username;
   let password = request.body.password;
   console.log(username);
   console.log(password);

   if (username && password) {
      // Execute SQL query that'll select the account from the database based on the specified username and password
      query = 'SELECT * FROM user WHERE username = ? AND password = ?';
      db.query(query, [username,password], function(error, results, fields) {
         //Output any problem with query
         if(error) throw error; 
         // If the account exists
         if (results.length > 0) {
            request.session.loggedin = true;
            request.session.username = username;
            //Redirect to home page
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

app.get('/home', function(request,response) {
   //If the user is logged in 
   if (request.session.loggedin) {
      response.send('Welcome back, ' + request.session.username + '!');
   } else {
      //Not logged in 
      response.send('Please login to view the page!');
   }
   response.end();
})






/*app.get('/logout', function(requst, response, next) {
   request.session.destroy();

   response.redirect("/user_home.html");
});
*/
app.listen(3000, () => {
   console.log("Server started on port 3000");
});