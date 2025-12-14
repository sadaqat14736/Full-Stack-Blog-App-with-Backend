const express = require("express");
const userData = require("./router/route");
const dbCon = require("./db/dbConnection");
const blogRoute = require("./router/blogRoute");


const app = express();
const PORT = 3000 || process.env.PORT;

dbCon(); // <-- call database connection

app.use(express.json());

// APIs Calling
app.use("/api", userData);
app.use("/api/blog", blogRoute);


// checking
app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(PORT, () => {
     console.log(`Server is running ${PORT}`);
});
