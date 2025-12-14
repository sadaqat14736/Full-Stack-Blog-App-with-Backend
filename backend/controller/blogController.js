const blogModel =  require("../db/blogSchema");

async function createBlog(req, res) {
    try{
        const { title, content } = req.body;

        if(!title || !content){
            return res.status(400).send({
                status: 400,
                message: "Title and content are required"
            });
        }


        const blog = new blogModel ({
            title,
            content,
            author: req.user.email,
            userId: req.user.id
        });


        const result = await blog.save();
        res.status(200).send({
            status: 200,
            message: "Blog created successfully",
            blog: result
        });

    } 

    catch (err) {
        res.status(500).send({
            status: 500,
            message: "Server error",
            err
        });
    }
}


async function getAllBlogs(req, res) {
    try{
        const blogs = await blogModel.find().sort({ createdAt: -1 }); // latest first
        res.status(200).send({
            status: 200,
            message: "All blogs fetched successfully",
            blogs
        });    
    }
    catch (err) {
        res.status(500).send({
            status: 500,
            message: "Server error",
            err,
        });
    }
}

module.exports = { createBlog, getAllBlogs };
