// logoutController.js
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send("Error on logout");
    } else {
      res.redirect("/login.html");
    }
  });
};
