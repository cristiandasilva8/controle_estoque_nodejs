// src/controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/userModel');
const configs = require('../config/configs');

const createUser = async (req, res) => {
    const { nome, email, senha } = req.body;
    // Aqui você adicionaria validação e verificação de existência do usuário
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = { nome, email, senha: hashedPassword };
    users.create(newUser); // Substituir por lógica de banco de dados
    res.redirect('/login?success=true');
};

const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await users.findOne({ where: { email: email } });
        if (!user) {
            // Passa a mensagem de erro para a página de login
            return res.render('login', { error: 'Usuário não encontrado.' });
        }

        const match = await bcrypt.compare(senha, user.senha);
        if (match) {
            const token = jwt.sign({ email }, configs.secret, { expiresIn: '1h' });
            res.cookie('jwtToken', token, {
                httpOnly: true,
                maxAge: 3600000 // Tempo de expiração em milissegundos (1 hora)
            });
            return res.redirect('/dashboard');
        } else {
            // Passa a mensagem de erro para a página de login
            return res.render('login', { error: 'Senha incorreta.' });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        // Passa a mensagem de erro para a página de login
        return res.render('login', { error: 'Erro interno do servidor.' });
    }
};


module.exports = { createUser, loginUser };
