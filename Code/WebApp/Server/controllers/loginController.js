// loginController.js
const userService = require("../services/userService");

exports.login = (req, res) => {
  const { username, password } = req.body;
  userService.authenticateUser(username, password, (error, user) => {
    if (error) {
      res.status(500).send("Internal server error");
    } else if (user) {
      req.session.username = user.username;
      res.redirect("/user_home.html");
    } else {
      res.status(401).send("Incorrect username or password");
    }
  });
};
