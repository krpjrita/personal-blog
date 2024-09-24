import "dotenv/config";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import router from "./server/routes/main.js";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./server/config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

// Template Engine
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', router);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})