import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const server = express();
const PORT = process.env.PORT ?? 4000;

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
