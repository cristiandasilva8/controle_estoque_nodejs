const clienteFornecedorModel = require('../models/clienteFornecedorModel');
const RegistroEstoqueModel = require('../models/registroEstoqueModel');

// Função de utilidade para validar dados de entrada do produto
const validateClienteFornecedorInput = (nome, cpf_cnpj, tipo) => {
    let errors = [];
    if (!nome) errors.push("Nome é obrigatório");
    if (!cpf_cnpj) errors.push("CPF ou CNPJ é obrigatória");
    if (!tipo) errors.push("Tipo é inválido ou obrigatório");
    return errors;
};

const createClienteFornecedor = async (req, res) => {
    const { nome, cpf_cnpj, tipo } = req.body;
    let status = 1;
    // executa a validação dos dados
    const validationErrors = validateClienteFornecedorInput(nome, cpf_cnpj, tipo);
    if (validationErrors.length > 0) {
        res.redirect('/clientes-fornecedores?success=false&message=Verifique os campos, alguns estão vazios');
        return;
    }

    const newClienteFornecedor = { nome, cpf_cnpj, tipo, status };
    try {
        const createdClienteFornecedor = await clienteFornecedorModel.create(newClienteFornecedor);
        res.redirect('/clientes-fornecedores?success=true');
    } catch (error) {
        console.error("Erro ao criar o cliente/fornecedor:", error);
        res.redirect('/clientes-fornecedores?success=false&message=Erro ao criar o produto.');
        return;
    }
};

const getAllClientesFornecedores = async (req, res) => {
    // Busca todos os produtos disponíveis
    const clientes_fornecedores = await clienteFornecedorModel.findAll({
        where: { status: 1 }
    });
    return clientes_fornecedores;
}

// Edição de produto
const editClienteFornecedor = async (req, res) => {
    const { id } = req.params;
    const { nome, cpf_cnpj, tipo } = req.body;

    const validationErrors = validateClienteFornecedorInput(nome, cpf_cnpj, tipo);
    if (validationErrors.length > 0) {
        res.redirect('/clientes-fornecedores?success=false&message=Verifique os campos, alguns estão vazios');
        return;
    }
    try {
        const clienteFornecedor = await clienteFornecedorModel.findByPk(id);

        if (!clienteFornecedor) {
            res.redirect('/clientes-fornecedores?success=false&message=Cliente/Fornecedor não encontrado');
            return;
        }
        await clienteFornecedor.update({
            nome,
            cpf_cnpj,
            tipo
        });
        res.redirect('/clientes-fornecedores?success=true');
    } catch (error) {
        res.redirect('/clientes-fornecedores?success=false&message=Erro ao atualizar o cliente/fornecedor');
    }
};

const getClienteFornecedorDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const clienteFornecedor = await clienteFornecedorModel.findByPk(id); // Substitua `findById` pela função do seu modelo que retorna um produto pelo ID

        if (!clienteFornecedor) {
            return res.status(404).send('Cliente/Fornecedor não encontrado');
        }
        res.render('clienteFornecedorEditForm', { clienteFornecedor }); // Renderiza a página de detalhes com os dados do produto
    } catch (error) {
        console.error('Erro ao registrar cliente/fornecedor:', error)
        res.status(500).send('Erro ao recuperar os detalhes do cliente/fornecedor');
    }
};


// Edição de produto
const deleteClienteFornecedor = async (req, res) => {
    const { id } = req.params;
    try {
        // Primeiro, verifica se existem pedidos associados ao ClienteFornecedor
        const pedidos = await RegistroEstoqueModel.findAll({
            where: { cliente_fornecedor_id: id }
        });
        // Se existirem pedidos, atualizar o status para 0 em vez de excluir
        if (pedidos.length > 0) {
            await clienteFornecedorModel.update({ status: 0 }, {
                where: { id }
            });
            return res.json({ success: true, message: "Cliente/Fornecedor foi desativado porque existe pedidos ligado a ele!" });
        }
        const resultado = await clienteFornecedorModel.destroy({
            where: { id } // condição para encontrar o cliente pelo ID
        });

        if (resultado === 0) {
            // Nenhum registro foi deletado, o que geralmente indica que o cliente com esse ID não foi encontrado
            res.status(404).json({ success: false, message: "Nenhum registro foi deletado, indica que o cliente com esse ID não foi encontrado." });
        } else {
            // Cliente excluído com sucesso
            res.json({ success: true, message: "Cliente/Fornecedor deletado com sucesso!" });
        }
    } catch (error) {
        console.error('Erro ao excluir cliente/fornecedor:', error);
        res.status(500).json({ success: false, message: "Erro ao excluir o cliente/fornecedor." });
    }
};

module.exports = { createClienteFornecedor, editClienteFornecedor, getClienteFornecedorDetails, deleteClienteFornecedor, getAllClientesFornecedores };
