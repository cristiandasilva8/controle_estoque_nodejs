const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importe a conexão do arquivo database.js

const Produto = sequelize.define('Produto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantidade_de_estoque: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    limite_estoque_baixo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    criado_em: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    // Opções do modelo
    timestamps: false, // Desabilita a criação automática de createdAt e updatedAt
    tableName: 'produtos' // Nome da tabela no banco de dados
});

module.exports = Produto;
