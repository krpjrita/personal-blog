import express from "express";
import Post from "../model/Post.js";

const router = express.Router();

/**
 * GET
 * HOME
 */
router.get('/', async (req, res) => {
    try {

        const locals = {
            title: "Notebook",
            description: "Notebook Blog",
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
        
        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: "/"
        });

    } catch (error) {
        console.log(error);
    }
});

router.get('/about', (req, res) => {
    res.render("about");
});

router.get('/contact', (req, res) => {
    res.render("contact");
});

export default router;