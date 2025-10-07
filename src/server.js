import app from './app';

const appPort = process.env.APP_PORT;
const mongoPort = process.env.MG_PORT;

app.listen(appPort, () => console.log(`Server running on port ${appPort}...`));

app.listen(mongoPort, () =>
  console.log(`Mongo running on port ${mongoPort}...`),
);
