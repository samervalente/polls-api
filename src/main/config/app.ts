import express from 'express';
import dotenv from 'dotenv';
import setupMiddlewares from './middlewares';

dotenv.config();

const server = express();
setupMiddlewares(server);

export default server;
