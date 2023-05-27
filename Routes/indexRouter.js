import express from 'express';
import { indexController } from '../Controller/indexController.js';

export const indexRouter = express.Router();

indexRouter.get('/:urlId', indexController);