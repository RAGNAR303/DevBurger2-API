import app from './app';

const APP_PORT = 3002;
const MONGO_PORT = 27017;

app.listen(APP_PORT, () =>
  console.log(`Server running on port ${APP_PORT}...`),
);

app.listen(MONGO_PORT, () =>
  console.log(`Mongo running on port ${MONGO_PORT}...`),
);
