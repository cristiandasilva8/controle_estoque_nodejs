const jwt = require('jsonwebtoken');
const configs = require('../config/configs');
const verifyToken = (req, res, next) => {
    const token = req.cookies.jwtToken; // Supondo que o token JWT esteja presente em um cookie chamado jwtToken

    if (token) {
        jwt.verify(token, configs.secret, (err, decoded) => {
            if (err) {
                // Se houver um erro na verificação do token, redirecione para a página de login ou envie uma resposta de erro
                return res.redirect('/login');
            } else {
                // Se o token for válido, armazene os dados do usuário decodificados no objeto req para uso posterior
                req.user = decoded;
                next(); // Avança para a próxima função de middleware ou rota
            }
        });
    } else {
        // Se não houver token presente, redirecione para a página de login ou envie uma resposta de erro
        return res.redirect('/login');
    }
};

module.exports = verifyToken;
