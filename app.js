const express = require('express');
const app = express();
const path = require('path');
// Importando as rotas
const { authRoutes, dashboardRoutes } = require('./src/routes');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

// Middleware para análise de cookies
app.use(cookieParser());

// Middlewares para análise de corpo de requisições JSON e URL-encoded
app.use(express.urlencoded({ extended: true })); // Para análise de dados de formulário
app.use(express.json()); // Para análise de application/json
app.use((req, res, next) => {
    console.log(`Método original da requisição: ${req.method}`);
    if (req.body && req.body._method) {
        console.log(`Valor do _method encontrado no corpo da requisição: ${req.body._method}`);
    } else {
        console.log('Campo _method não encontrado no corpo da requisição.');
    }
    next();
});


app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))
// Configuração do mecanismo de visualização (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Redireciona a raiz para a rota de login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Middleware de log para diagnosticar problemas com o method-override
app.use((req, res, next) => {
    console.log(`Requisição recebida: ${req.method} para ${req.url}`);
    next();
});

// Usando as rotas definidas
app.use(authRoutes);
app.use(dashboardRoutes);

// Configurando a porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
