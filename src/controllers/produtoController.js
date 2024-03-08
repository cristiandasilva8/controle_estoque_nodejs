const produtoModel = require('../models/produtoModel');

// Função de utilidade para validar dados de entrada do produto
const validateProdutoInput = (nome, descricao, preco) => {
    let errors = [];
    if (!nome) errors.push("Nome é obrigatório");
    if (!descricao) errors.push("Descrição é obrigatória");
    if (!preco || isNaN(preco)) errors.push("Preço é inválido ou obrigatório");
    return errors;
};

const createProduto = async (req, res) => {
    const { nome, descricao, preco, quantidade_de_estoque, limite_estoque_baixo } = req.body;

    // executa a validação dos dados
    const validationErrors = validateProdutoInput(nome, descricao, preco, quantidade_de_estoque, limite_estoque_baixo);
    if (validationErrors.length > 0) {
        res.redirect('/produtos?success=false&message=Verifique os campos, alguns estão vazios');
        return;
    }

    const newProduto = { nome, descricao, preco, quantidade_de_estoque, limite_estoque_baixo };
    try {
        const createdProduto = await produtoModel.create(newProduto);
        res.redirect('/produtos?success=true');
    } catch (error) {
        console.error("Erro ao criar o produto:", error);
        res.redirect('/produtos?success=false&message=Erro ao criar o produto.');
        return;
    }
};

// Edição de produto
const editProduto = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade_de_estoque, limite_estoque_baixo } = req.body;

    const validationErrors = validateProdutoInput(nome, descricao, preco, quantidade_de_estoque, limite_estoque_baixo);
    if (validationErrors.length > 0) {
        res.redirect('/produtos?success=false&message=Verifique os campos, alguns estão vazios');
        return;
    }

    try {
        const produto = await produtoModel.findByPk(id);

        if (!produto) {
            res.redirect('/produtos?success=false&message=Produto não encontrado');
            return;
        }

        await produto.update({
            nome,
            descricao,
            preco,
            quantidade_de_estoque,
            limite_estoque_baixo
        });
        res.redirect('/produtos?success=true');
    } catch (error) {
        res.redirect('/produtos?success=false&message=Erro ao atualizar o produto');
    }
};

const getAllProdutos = async (req, res) => {
    // Busca todos os produtos disponíveis
    const produtos = await produtoModel.findAll();
    return produtos;
}

const getProdutoDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const produto = await produtoModel.findByPk(id); // Substitua `findById` pela função do seu modelo que retorna um produto pelo ID

        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }
        res.render('produtos/produtoEditForm', { produto }); // Renderiza a página de detalhes com os dados do produto
    } catch (error) {
        console.error('Erro ao registrar usuário:', error)
        res.status(500).send('Erro ao recuperar os detalhes do produto');
    }
};

// Edição de produto
const deleteProduto = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await produtoModel.destroy({
            where: {
                id: id // condição para encontrar o produto pelo ID
            }
        });

        if (resultado === 0) {
            // Nenhum registro foi deletado, o que geralmente indica que o cliente com esse ID não foi encontrado
            res.status(404).json({ success: false, message: "Nenhum registro foi deletado, indica que o produto com esse ID não foi encontrado." });
        } else {
            // Cliente excluído com sucesso
            res.json({ success: true, message: "Produto deletado com sucesso!" });
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ success: false, message: "Erro ao excluir o produto." });
    }
};

module.exports = { createProduto, editProduto, getProdutoDetails, deleteProduto, getAllProdutos };
