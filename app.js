import "dotenv/config";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import router from "./server/routes/main.js";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./server/config/db.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
}))

app.use(express.static(__dirname + '/public'));

// Template Engine
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', router);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})