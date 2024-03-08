const { Sequelize } = require('sequelize');

// Configuração da conexão
const sequelize = new Sequelize('controle_estoque', 'postgres', 'postgre', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Desabilita a log de SQL no console
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Testando a conexão
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexão estabelecida com sucesso.');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}

testConnection();

module.exports = sequelize;
