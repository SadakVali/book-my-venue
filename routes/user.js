// const modules
const express = require("express");

// const controllers
const { signup, login } = require("../controllers/Auth");

// initialize a router instance
const router = express.Router();

// ######## create routes ########
// user signup related routes
router.post("/signup", signup);
// user login related routes
router.post("/login", login);

// export the user routes
module.exports = router;
