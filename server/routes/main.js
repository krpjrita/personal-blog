import express from "express";
import Post from "../model/Post.js";

const router = express.Router();

/**
 * GET
 * HOME
 */
router.get('/', async (req, res) => {

        const locals = {
            title: "Notebook",
            description: "Notebook Blog",
        }

        try {
            const data = await Post.find();
            res.render('index', { locals, data });
        } catch (error) {
            console.log(error);
        }
});

function insertPostData() {
    Post.insertMany([
        {
            title: 'Building a Blog',
            body: 'This is the body text'
        },
        {
            title: 'LaLaLa',
            body: 'Body Body'
        },
        {
            title: 'Trititi',
            body: 'blablabla'
        },
    ])
}

insertPostData();


router.get('/about', (req, res) => {
    res.render("about");
});

router.get('/contact', (req, res) => {
    res.render("contact");
});

export default router;