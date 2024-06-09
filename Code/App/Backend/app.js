// Main server file
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const dbConfig = require("./config/dbConfig");
const session = require("express-session");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Set up database connection
const db = mysql.createConnection(dbConfig);

db.connect((error) => {
  if (error) {
    console.log("Error connecting to MySQL", error);
    process.exit(1);
  } else {
    console.log("MySQL Connected...");
  }
});

// Set up middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../WebApp/Client/static")));

// Routes
app.use("/", userRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
