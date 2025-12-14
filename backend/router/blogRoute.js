const express = require("express");
const { createBlog, getAllBlogs } = require("../controller/blogController");
const authMiddleware = require("../middleware/authentication");


const router = express.Router();


// Protected route to create blog
router.post("/createBlog", authMiddleware, createBlog);
// Public route to fetch all blogs
router.get("/all", getAllBlogs);


module.exports = router;