const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const logoutController = require("../controllers/logoutController");

router.post("/login", loginController.login);
router.get("/logout", logoutController.logout);

module.exports = router;
