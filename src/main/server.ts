import server from './config/app';
const PORT = process.env.PORT ?? 4000;

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
