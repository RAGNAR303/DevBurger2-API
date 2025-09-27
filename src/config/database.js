module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5434, // Configuração que foi feita nop banco , variavel na criação do container no docker
  username: 'postgres',
  password: 'postgres',
  database: 'devburger2',
  define: {
    timestamps: true, // criar o updated_at e created_at
    underscored: true,
    underscoredAll: true,
  },
};
