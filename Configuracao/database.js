// ...existing code...
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false, // Desabilita logs SQL no console
    define: {
      underscored: true,
      timestamps: false,
      freezeTableName: true
    }
  }
);

async function testarConexao() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao Supabase:', error);
  }
}

// Exporta a instância e a função de teste
module.exports = { sequelize, testarConexao };
// ...existing code...