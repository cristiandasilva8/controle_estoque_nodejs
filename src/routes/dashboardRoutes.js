const express = require('express');
const path = require('path');
const router = express.Router();
const verifyToken = require('./verifyToken'); // Importe o middleware de verificação de token
const produtoController = require('../controllers/produtoController'); // Importe o controller
const clienteFornecedorController = require('../controllers/clienteFornecedorController'); // Importe o controller
const registroEstoqueController = require('../controllers/registroEstoqueController'); // Importe o controller

// Rota protegida do dashboard
router.get('/dashboard', verifyToken, (req, res) => {
    res.render('dashboard');
});

// Rota para listar produtos
router.get('/produtos', verifyToken, async (req, res) => {
    try {
        // Verificar se o parâmetro 'success' está presente na query da URL
        let message = null;
        if (req.query.success === 'true') {
            message = 'Operação realizada com sucesso!';
        } else {
            message = req.query.message;
        }
        const produtos = await produtoController.getAllProdutos(); // Busca todos os produtos do banco de dados

        res.render('produtos/produtos', { message: message, produtos: produtos }); // Renderiza a página HTML 'produtos' e passa os produtos para a view
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Rota para visualizar informações/formulário de cadastro de produto
router.get('/cadastro-produto', verifyToken, (req, res) => {
    res.render('produtos/produtoForm');
});

// Rota para criar um novo produto - ajustada para consistência de mensagens
router.post('/cadastro-produto', verifyToken, async (req, res) => {
    await produtoController.createProduto(req, res);
    // O redirecionamento ou renderização com mensagem específica será manuseado pelo controlador
});

// Rota para visualizar detalhes do produto antes de editar
router.get('/produto/:id', verifyToken, async (req, res) => {
    await produtoController.getProdutoDetails(req, res);
});

// Rota para edição de produtos
router.put('/editar-produto/:id', verifyToken, async (req, res) => {
    await produtoController.editProduto(req, res);
    // O controlador decide como responder após a operação de edição
});
// Rota para deletar um produto - agora o controlador manipula a resposta
router.delete('/produto/:id', verifyToken, async (req, res) => {
    await produtoController.deleteProduto(req, res);
    // O controlador é responsável por enviar a resposta adequada
});


// Rota para listar clientes
router.get('/clientes-fornecedores', verifyToken, async (req, res) => {
    try {
        // Verificar se o parâmetro 'success' está presente na query da URL
        let message = null;
        if (req.query.success === 'true') {
            message = 'Operação realizada com sucesso!';
        } else {
            message = req.query.message;
        }
        const clientesFornecedores = await clienteFornecedorController.getAllClientesFornecedores(); // Busca todos os produtos do banco de dados

        res.render('clientesFornecedores/clientesFornecedores', { message: message, clientesFornecedores: clientesFornecedores }); // Renderiza a página HTML 'produtos' e passa os produtos para a view
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Rota para visualizar informações/formulário de cadastro de produto
router.get('/cadastro-cliente-fornecedor', verifyToken, (req, res) => {
    res.render('clientesFornecedores/clienteFornecedorForm');
});

// Rota para criar um novo produto - ajustada para consistência de mensagens
router.post('/cadastro-cliente-fornecedor', verifyToken, async (req, res) => {
    await clienteFornecedorController.createClienteFornecedor(req, res);
    // O redirecionamento ou renderização com mensagem específica será manuseado pelo controlador
});

// Rota para visualizar detalhes do produto antes de editar
router.get('/cliente-fornecedor/:id', verifyToken, async (req, res) => {
    await clienteFornecedorController.getClienteFornecedorDetails(req, res);
});

// Rota para edição de produtos
router.put('/editar-cliente-fornecedor/:id', verifyToken, async (req, res) => {
    await clienteFornecedorController.editClienteFornecedor(req, res);
    // O controlador decide como responder após a operação de edição
});
// Rota para deletar um produto - agora o controlador manipula a resposta
router.delete('/cliente-fornecedor/:id', verifyToken, async (req, res) => {
    await clienteFornecedorController.deleteClienteFornecedor(req, res);
    // O controlador é responsável por enviar a resposta adequada
});

/**
 * ROTAS PARA O CONTROLE DO ESTOQUE E PEDIDOS
 */

// Rota para exibir a página de registro de pedido
router.get('/pedidos', verifyToken, async (req, res) => {

    let message = null;
    if (req.query.success === 'true') {
        message = 'Operação realizada com sucesso!';
    } else {
        message = req.query.message;
    }

    const pedidos = await registroEstoqueController.getAllPedidos(req, res);
    res.render('pedidos/pedidos', { pedidos, message });
});

// Rota para exibir a página de registro de pedido
router.get('/criar-pedido', verifyToken, async (req, res) => {
    try {
        // Busca todos os produtos disponíveis
        const produtos = await produtoController.getAllProdutos();
        const clientes_fornecedores = await clienteFornecedorController.getAllClientesFornecedores();
        // Renderiza a view 'pedido.ejs' passando os produtos encontrados
        res.render('pedidos/pedidosForm', { produtos, clientes_fornecedores });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.put('editar-pedido', verifyToken, async (req, res) => {
    await registroEstoqueController.editPedido(req, res);
})

// Rota para cadastrar pedido e registrar entrada no estoque
router.post('/pedidos', verifyToken, async (req, res) => {
    await registroEstoqueController.createPedido(req, res);
});

router.delete('/pedidos/:id', verifyToken, async (req, res) => {
    await registroEstoqueController.deletePedido(req, res);
});


module.exports = router;
