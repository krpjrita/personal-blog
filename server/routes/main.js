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
            description: "Simple blog created with NodeJS, ExpressJS and MongoDB.",
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


/**
 * GET
 * Post :id
 */
router.get('/post/:id', async (req, res) => {
    try {

        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "Post description to insert in DB"
        }

        res.render('post', { locals, data, currentRoute: `/post/${slug}` });

    } catch (error) {
        console.log(error);
    }
});


/**
 * POST
 * Post - searchTerm
 */
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Post description to insert in DB"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]
        });

        res.render('search', { locals, data, currentRoute: "/search" });

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