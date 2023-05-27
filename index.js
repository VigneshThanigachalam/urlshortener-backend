import express from "express";
import dotenv from 'dotenv';
import { db_connect } from "./Configure/db_connect.js";
import { urlRouter } from "./Routes/urlRouter.js";
import { indexRouter } from "./Routes/indexRouter.js";
import cors from "cors";
import { authRouter } from "./Routes/authRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

db_connect();
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(notFound);
app.use(errorHandler);

app.use("/api/url-user", authRouter);
app.use('/api', indexRouter);
app.use('/api/create', urlRouter);

app.listen(PORT, () => console.log(`app listening on ${PORT}`))