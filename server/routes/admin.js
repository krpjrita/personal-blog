import express from "express";
import Post from "../model/Post.js";

const router = express.Router();

const adminLayout = '../views/layouts/admin';

/**
 * GET
 * Admin - Login Page
 */
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Admin Login Page"
        }

        res.render('admin/login', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});


/**
 * POST
 * Admin - Check Login
 */
router.post('/admin', async (req, res) => {
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


export default router;