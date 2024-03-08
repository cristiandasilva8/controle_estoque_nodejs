const registroEstoqueModel = require('../models/registroEstoqueModel');

// Função de utilidade para validar dados de entrada do produto
const validatePedidoInput = (produto_id, quantidade, tipo, cliente_fornecedor_id) => {
    let errors = [];
    if (!produto_id) errors.push("Produto é obrigatório");
    if (!quantidade) errors.push("quantidade é obrigatória");
    if (!tipo) errors.push("Tipo é obrigatória");
    if (!cliente_fornecedor_id) errors.push("Cliente é obrigatória");
    return errors;
};
const getAllPedidos = async (req, res) => {
    const { dataInicio, dataFim, tipo } = req.query;
    const pedidos = registroEstoqueModel.buscarPedidosComFiltros(dataInicio, dataFim, tipo);
    return pedidos;
}
const createPedido = async (req, res) => {
    const { produto_id, quantidade, tipo, cliente_fornecedor_id } = req.body;
    // executa a validação dos dados
    const validationErrors = validatePedidoInput(produto_id, quantidade, tipo, cliente_fornecedor_id);
    if (validationErrors.length > 0) {
        res.redirect('/pedidos?success=false&message=Verifique os campos, alguns estão vazios');
        return;
    }

    const newPedido = { produto_id, quantidade, tipo, cliente_fornecedor_id };
    try {
        const createdPedido = await registroEstoqueModel.criarRegistro(newPedido);
        res.redirect('/pedidos?success=true');
    } catch (error) {
        console.error("Erro ao criar o pedido:", error);
        res.redirect('/pedidos?success=false&message=Erro ao criar o pedido.');
        return;
    }
};

// Edição de produto
const editPedido = async (req, res) => {
    const { id } = req.params;
    const { produto_id, quantidade, tipo, cliente_fornecedor_id } = req.body;

    const validationErrors = validatePedidoInput(produto_id, quantidade, tipo, cliente_fornecedor_id);
    if (validationErrors.length > 0) {
        res.redirect('/pedidos?success=false&message=Verifique os campos, alguns estão vazios');
        return;
    }

    try {
        const pedido = await registroEstoqueModel.findByPk(id);

        if (!pedido) {
            res.redirect('/pedidos?success=false&message=Pedido não encontrado');
            return;
        }

        await pedido.update({
            produto_id, quantidade, tipo, cliente_fornecedor_id
        });
        res.redirect('/pedidos?success=true');
    } catch (error) {
        res.redirect('/pedidos?success=false&message=Erro ao atualizar o pedido');
    }
};

const getPedidoDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const pedido = await registroEstoqueModel.findByPk(id); // Substitua `findById` pela função do seu modelo que retorna um pedido pelo ID

        if (!pedido) {
            return res.status(404).send('Pedido não encontrado');
        }
        res.render('pedidos/pedidoEditForm', { pedido }); // Renderiza a página de detalhes com os dados do pedido
    } catch (error) {
        console.error('Erro ao registrar Pedido:', error)
        res.status(500).send('Erro ao recuperar os detalhes do pedido');
    }
};

// Edição de produto
const deletePedido = async (req, res) => {
    const { id } = req.params;
    try {
        const retorno = await registroEstoqueModel.deletarPedido(id);
        if (!retorno.success) {
            // Nenhum registro foi deletado, o que geralmente indica que o pedido com esse ID não foi encontrado
            res.status(404).json({ success: false, message: "Nenhum registro foi deletado, indica que o pedido com esse ID não foi encontrado." });
        } else {
            // Cliente pedido com sucesso
            res.json({ success: true, message: "Pedido deletado com sucesso!" });
        }
    } catch (error) {
        console.error('Erro ao excluir pedido:', error);
        res.status(500).json({ success: false, message: "Erro ao excluir o pedido." });
    }
};

module.exports = { createPedido, editPedido, getPedidoDetails, deletePedido, getAllPedidos };
