// Dentro do seu modelo RegistroEstoque.js

const { Model, Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database'); // O caminho para o seu arquivo de configuração do Sequelize
const Produto = require('./produtoModel'); // Importa o modelo Produto
const ClienteFornecedor = require('./clienteFornecedorModel'); // Importa o modelo Produto

class RegistroEstoque extends Model {

    static async criarRegistro(pedido) {
        const { produto_id, quantidade, tipo, cliente_fornecedor_id } = pedido;
        return await sequelize.transaction(async (t) => {
            // Busca o produto pelo ID
            const produto = await Produto.findByPk(produto_id, { transaction: t });

            if (!produto) {
                throw new Error('Produto não encontrado.');
            }

            let novaQuantidade = produto.quantidade_de_estoque;
            if (tipo === 'entrada') {
                novaQuantidade += parseInt(quantidade, 10);
            } else if (tipo === 'saida') {
                if (produto.quantidade_de_estoque < quantidade) {
                    throw new Error('Estoque insuficiente.');
                }
                novaQuantidade -= parseInt(quantidade, 10);
            }

            // Atualiza a quantidade de produtos em estoque
            await produto.update({ quantidade_de_estoque: novaQuantidade }, { transaction: t });

            // Cria um novo registro de estoque
            const novoRegistro = await RegistroEstoque.create({
                produto_id,
                quantidade,
                tipo,
                cliente_fornecedor_id,
                data_operacao: new Date()
            }, { transaction: t });

            return novoRegistro;
        });
    }

    static async buscarPedidosComFiltros(dataInicio = null, dataFim = null, tipo = null) {
        let where = {};

        // Se dataInicio e dataFim não forem fornecidos, define o intervalo para o mês corrente
        if (!dataInicio || !dataFim) {
            const agora = new Date();
            dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
            dataFim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
        }

        // Adiciona filtro de data à cláusula WHERE
        where.data_operacao = {
            [Op.between]: [dataInicio, dataFim]
        };

        // Adiciona filtro de tipo à cláusula WHERE, se fornecido
        if (tipo && tipo !== 'todos') {
            where.tipo = tipo;
        }

        try {
            const pedidos = await RegistroEstoque.findAll({
                where: where,
                include: [
                    { model: Produto, as: 'produto', attributes: ['nome'] },
                    { model: ClienteFornecedor, as: 'cliente_fornecedor', attributes: ['nome'] }
                ], // Assume que você tenha a associação configurada
                order: [['data_operacao', 'ASC']] // Ordena os registros pela data de operação
            });
            return pedidos;

        } catch (error) {
            console.error('Erro ao buscar pedidos com filtros:', error);
            throw error;
        }
    }

    static async deletarPedido(id) {
        return await sequelize.transaction(async (t) => {
            // Busca o pedido pelo ID dentro da transação
            const pedido = await RegistroEstoque.findByPk(id, { transaction: t });

            // Se o pedido não existir, lança um erro
            if (!pedido) {
                return { success: true, message: "Pedido não encontrado." };
            }

            // Busca o produto associado ao pedido dentro da transação
            const produto = await Produto.findByPk(pedido.produto_id, { transaction: t });

            if (!produto) {
                return { success: true, message: "Produto associado ao pedido não encontrado." };
            }

            // Atualiza a quantidade de estoque do produto com base no tipo de pedido
            if (pedido.tipo === 'entrada') {
                // Se for entrada, subtrai a quantidade do pedido do estoque
                produto.quantidade_de_estoque -= pedido.quantidade;
            } else if (pedido.tipo === 'saida') {
                // Se for saída, adiciona a quantidade do pedido ao estoque
                produto.quantidade_de_estoque += pedido.quantidade;
            }

            // Atualiza o produto com a nova quantidade de estoque dentro da transação
            await produto.save({ transaction: t });

            // Deleta o pedido dentro da transação
            await pedido.destroy({ transaction: t });

            // Retorna uma mensagem de sucesso
            return { success: true, message: "Pedido deletado e estoque ajustado com sucesso!" };
        });
    }
}

RegistroEstoque.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'produtos', // nome da tabela de produtos
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            isIn: [['entrada', 'saida']]
        }
    },
    nome_cliente: {
        type: DataTypes.STRING(255),
        allowNull: true // Pode ser nulo
    },
    cliente_fornecedor_id: {
        type: DataTypes.INTEGER,
        references: { model: 'cliente_fornecedor', key: 'id' },
        onDelete: 'SET NULL',
    },
    data_operacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW // Aqui definimos o valor padrão para a data e hora atual
    }
}, {
    sequelize,
    tableName: 'registro_estoque', // Especifica o nome da tabela se for diferente do padrão
    timestamps: false, // Se você não estiver usando campos de timestamp como `createdAt` e `updatedAt`
    // outras opções do modelo
});

function defineAssociations() {
    RegistroEstoque.belongsTo(Produto, { foreignKey: 'produto_id', as: 'produto' });
    Produto.hasMany(RegistroEstoque, { foreignKey: 'produto_id' });

    RegistroEstoque.belongsTo(ClienteFornecedor, { foreignKey: 'cliente_fornecedor_id', as: 'cliente_fornecedor' });
    ClienteFornecedor.hasMany(RegistroEstoque, { foreignKey: 'cliente_fornecedor_id' });
}

defineAssociations();


module.exports = RegistroEstoque;
