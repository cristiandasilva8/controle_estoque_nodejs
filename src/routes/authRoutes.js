// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path'); // Importa o módulo path
const User = require('../models/userModel'); // Importe o modelo User
const userController = require('../controllers/userController'); // Importe o controller

// Rota para o formulário de registro
router.get('/registro', (req, res) => {
    res.render('registro', {});
});

// Rota para processar o registro de um novo usuário
router.post('/registro', async (req, res) => {
    // Aqui você capturaria os dados do formulário, como req.body.email e req.body.password
    // Em um cenário real, você salvaria esses dados em um banco de dados
    // Por enquanto, vamos apenas simular esse processo imprimindo os dados no console
    //console.log('Dados do registro:', req.body);
    // Após "registrar" o usuário, redirecionamos para a página de login
    //res.redirect('/login');

    try {
        // Chamar o método do controlador para criar um novo usuário
        const newUser = await userController.createUser(req, res);
    } catch (error) {
        // Tratar erros, por exemplo, usuário já existente
        console.error('Erro ao registrar usuário:', error);
        res.send('Erro ao registrar usuário.');
    }

});

// Rota para o formulário de login
router.get('/login', (req, res) => {

    // Verificar se um token JWT está presente na solicitação
    const token = req.cookies.jwtToken;
    if (token) {
        // Um token JWT está presente na solicitação, o usuário já está autenticado
        // Você pode redirecionar para o dashboard ou enviar uma resposta informando que o usuário já está logado
        res.redirect('/dashboard');
        return; // Retorne para evitar que o código abaixo seja executado
    }
    res.render('login', { error: null });
});

// Rota para processar o login
router.post('/login', async (req, res) => {
    // Aqui você validaria os dados contra os armazenados em um banco de dados
    // Como estamos apenas simulando, vamos imprimir os dados de login
    //console.log('Dados do login:', req.body);
    // Aqui, você faria a lógica de autenticação
    // Se for bem-sucedido, você redirecionaria para a página principal do usuário ou painel de controle
    // Para este exemplo, vamos apenas enviar uma resposta simples
    //res.send('Login realizado com sucesso. Bem-vindo!');

    try {
        // Verificar se o usuário existe no banco de dados
        const newUser = await userController.loginUser(req, res);
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.send('Erro ao fazer login.');
    }
});

// Rota de logout
router.get('/logout', (req, res) => {
    res.cookie('jwtToken', '', {
        httpOnly: true,
        expires: new Date(0) // Define a data de expiração para uma data no passado
    });

    res.redirect('/login');
});

module.exports = router;
