// const modules
const express = require("express");

// const controllers
const { contactUsController } = require("../controllers/Contactus");

// initialize a router instance
const router = express.Router();

// #######################################################################
//                                ContactUs Routes
// #######################################################################
router.post("/contact", contactUsController);

// export the contactUs routes
module.exports = router;
