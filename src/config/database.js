module.exports = {
  dialect: 'postgres',
  host: process.env.PG_HOST,
  port: process.env.PG_PORT, // Configuração que foi feita nop banco , variavel na criação do container no docker
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  define: {
    timestamps: true, // criar o updated_at e created_at
    underscored: true,
    underscoredAll: true,
  },
};
