import express from "express";
import router from "./main.js";
import adminRouter from "./admin.js";

export const allRoutes = express.Router();

allRoutes.use(router);
allRoutes.use(adminRouter);

export default allRoutes;