import express from "express";

const router = express.Router();

router.get('', (req, res) => {

    const locals = {
        title: "Notebook",
        description: "Simple blog created with NodeJS, ExpressJS and MongoDB."
    }

    res.render("index", { locals });
});

router.get('/about', (req, res) => {
    res.render("about");
});

router.get('/contact', (req, res) => {
    res.render("contact");
});

export default router;