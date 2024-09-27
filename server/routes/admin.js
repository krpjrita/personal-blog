import express from "express";
import Post from "../model/Post.js";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminRouter = express.Router();

const adminLayout = "../views/layouts/admin";
const adminControlPostsLayout = "../views/layouts/admin-controls-posts";
const jwtSecret = process.env.JWT_SECRET;


/**
 * Cookie Middleware
 * Check Login
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    
    if(!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}


/**
 * GET
 * Admin - Login Page
 */
adminRouter.get("/user", async (req, res) => {
    try {
        const locals = {
            title: "User",
            description: "Login or Register Page."
        }

        res.render("admin/login", { locals, currentRoute: "/user" });
    } catch (error) {
        console.log(error);
    }
});


/**
 * POST
 * Admin - Check Login
 */
adminRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne( { username } );

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) { 
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie("token", token, { httpOnly: true });
        
        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);
    }
});

/*

SIMPLE

adminRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (req.body.username === "admin" && req.body.password === "password") {
            res.send("You are logged in.")
        } else {
            res.send("Wrong credentials.")
        }
    } catch (error) {
        console.log(error);
    }
});

*/


/**
 * POST
 * Admin - Register
 */
adminRouter.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create ({ username, password: hashedPassword});
            res.status(201).json({ message: "User Created", user });
        } catch (error) {
            if(error.code === 11000) {
                res.status(409).json({ message: "User already in use" });
            }
            res.status(500).json({ message: "Internal server error"});
        }
        
    } catch (error) {
        console.log(error);
    }
});


/**
 * GET
 * Admin Dashboard
 */
adminRouter.get('/dashboard', authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: "Dashboard",
            description: "Admin Dashboard"
        }

        const data = await Post.find();

        res.render("admin/dashboard", { locals, data, layout: adminLayout, currentRoute: "/dashboard" });

    } catch (error) {
        console.log(error);
    }
});


/**
 * GET
 * Admin - Create New Post
 */
adminRouter.get('/create-post', authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: "Create Post",
            description: "Add New Post"
        }

        const data = await Post.countDocuments();

        res.render("admin/create-post", { locals, layout: adminLayout });

    } catch (error) {
        console.log(error);
    }
});


/**
 * POST
 * Admin - Create New Post
 */
adminRouter.post('/create-post', authMiddleware, async (req, res) => {

    try {
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body
        });

        await Post.create(newPost);

        res.redirect("admin/dashboard");

    } catch (error) {
        console.log(error);
    }
});


/**
 * GET
 * Admin - Edit Post
 */
adminRouter.get('/edit-post/:id', authMiddleware, async (req, res) => {

    try {

        const locals = {
            title: "Edit Post",
            description: "Edit Post"
        }

        const data = await Post.findOne({ _id: req.params.id });

        res.render("admin/edit-post", { locals, data, layout: adminControlPostsLayout });

    } catch (error) {
        console.log(error);
    }
});


/**
 * PUT
 * Admin - Edit Post
 */
adminRouter.put('/edit-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post${req.params.id}`);

    } catch (error) {
        console.log(error);
    }
});


/**
 * DELETE
 * Admin - Delete Post
 */
adminRouter.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect("admin/dashboard");

    } catch (error) {
        console.log(error);
    }
});


/**
 * Get
 * Admin Logout
 */
adminRouter.get("/logout", (req, res) => {
    try {

        res.clearCookie("token");
        // res.json({ message: "Logout successful." });
        res.redirect("/");

    } catch (error) {
        console.log(error);   
    }
})


export default adminRouter;