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

/*function isAuthenticated(request, response, next) {
  if (request.session && request.session.user) {
    return next();
  } else {
    response.status(401).json({ message: 'Unauthorized'});
  }
}*/

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
            response.json({ success: true, profileUrl: './user_home.html' });
         } else { 
            response.json({ message: 'Incorrect Username and/or Password!'});
         }
         response.end();
   });
   } else {
      response.json({ message: 'Please enter Username and Password!'});
      response.end();
   }
});

app.get('/home', function(request,response) {
   //If the user is logged in 
   if (request.session.loggedin) {
      response.json({ message: 'Welcome back, ' + request.session.username + '!'});
   } else {
      //Not logged in 
      response.status(401).json({ message: 'Please login to view the page!'});
   }
   response.end();
})

// Handle logout
app.get('/logout', (request, response) => {
    console.log('Before session destruction');
    // Destroy the session to log the user out
    request.session.destroy((err) => {
        if (err) {
            console.error(err);
            response.status(500).json({ message: 'Internal Server Error'});
        } else {
            // Log statement to confirm the session is destroyed
            console.log('Session destroyed successfully');
            // Send a success response
            response.json({ message: 'Logout successful!'});
        }
    });
    console.log('After session destruction');
});


//Handle inventory list
app.get('/getdata', (request, response, next) => {
   // MySQL query for inventory list
   const query = 'SELECT pl.id AS product_list_id, p.id AS product_id, p.name AS product_name, c.id AS category_id, c.name AS category_name, pl.quantity FROM Product_List pl JOIN Product p ON pl.product = p.id JOIN Category c ON p.category = c.id;';
   console.log('Query done');
   db.query(query, (err, results) => {
      if (err) {
         console.error('Error executing MySQL query:', err);
         response.status(500).json({ message: 'Internal Server Error' });
         return;
      } else {
      response.json(results);
      console.log(results);
      }
   });
});

//Handle service statistics 
app.get('/serviceStatisticsWithTime', async (request, response) => {
  // Perform queries to get statistics
  const queryNewRequests = 'SELECT DATE(date_in) AS date, COUNT(*) AS newRequestCount FROM Task WHERE type = "request" AND state = "published" GROUP BY DATE(date_in)';
  const queryProcessedRequests = 'SELECT DATE(date_in) AS date, COUNT(*) AS processedRequestCount FROM Task WHERE type = "request" AND state = "done" GROUP BY DATE(date_in)';
  const queryNewOffers = 'SELECT DATE(date_in) AS date, COUNT(*) AS newOfferCount FROM Task WHERE type = "offering" AND state = "published" GROUP BY DATE(date_in)';
  const queryProcessedOffers = 'SELECT DATE(date_in) AS date, COUNT(*) AS processedOfferCount FROM Task WHERE type = "offering" AND state = "done" GROUP BY DATE(date_in)';

  // Execute the queries
  const executeQuery = async (query) => {
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

  //Use async/await to execute queries in sequence
  const fetchStatistics = async () => {
    try {
    const newRequestData = await executeQuery(queryNewRequests);
    const processedRequestData = await executeQuery(queryProcessedRequests);
    const newOfferData = await executeQuery(queryNewOffers);
    const processedOfferData = await executeQuery(queryProcessedOffers);
  
    //Combine the data for plotting
    const combinedData = {
      newRequests: newRequestData,
      processedRequests: processedRequestData,
      newOffers: newOfferData,
      processedOffers: processedOfferData
    };

    //Send the data as JSON response
    response.json(combinedData);
    console.log(combinedData);
  } catch (error) {
    console.error('Error fetching service statistics with time:', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
}; 

  await fetchStatistics();
});

//Handle the volunteer account creation
/*app.get('/volunteer_registration', function(request, response) {
   response.sendFile(path.join(__dirname + '/v_account.html'));
});

app.post('v_register', function(request, response) {
   const {
      username,
      password,
      email,
      telephone,
      name,
      surname
   } = request.body;

   if(username && password && email && telephone && name && surname) {

      //Constant values 
      const longtitude = 39.368;
      const latitude = 22.953;
      const is_diasostis = 1;

      //Insert query for user table
      const query = 'INSERT INTO user (username, password, email, telephone, name, surname, longitude, latitude, is_diasostis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [username, password, email, name, surname, longtitude, latitude, is_diasostis], function(error, results, fields) {
         if(error) {
            console.error('Error executing MySQL query:', error);
            response.status(500).json({ message: 'Internal Server Error'});
         } else { 
            response.json({ success: true, message: 'Registration successful!'});
         }
      });
   } else {
      response.json({ message: 'Please fill in all the required fields.'});
   }
}); */  

app.listen(3000, () => {
   console.log("Server started on port 3000");
});