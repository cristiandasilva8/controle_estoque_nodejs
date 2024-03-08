const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importe a conexão do arquivo database.js

const User = sequelize.define('usuarios', {
    // Atributos do modelo
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Defina explicitamente a coluna de data de criação como 'criado_em'
    criado_em: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP') // Pode ser necessário ajustar conforme o seu banco de dados
    }
}, {
    // Opções do modelo
    timestamps: false // Desabilita a criação automática de createdAt e updatedAt
});

module.exports = User;
