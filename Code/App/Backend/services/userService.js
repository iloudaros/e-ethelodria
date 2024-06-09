const bcrypt = require("bcrypt");
const db = require("../config/dbConfig");

exports.authenticateUser = (username, password, callback) => {
  // SQL query to find the user by username
  const query = "SELECT * FROM user WHERE username = ?";

  db.query(query, [username], (error, results) => {
    if (error) {
      return callback(error);
    }
    if (results.length > 0) {
      // Compare provided password with the hashed password in the database
      bcrypt.compare(password, results[0].password, (err, isMatch) => {
        if (err) {
          return callback(err);
        }
        if (isMatch) {
          // Passwords match, return the user object
          return callback(null, results[0]);
        } else {
          // Passwords do not match
          return callback(null, false);
        }
      });
    } else {
      // No user found with that username
      return callback(null, false);
    }
  });
};
