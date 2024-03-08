# Sistema de Controle de Estoque Simples

Este é um sistema de controle de estoque desenvolvido como uma ferramenta educacional para ensinar alunos do SENAC. O sistema oferece funcionalidades básicas necessárias para a gestão de estoque, incluindo módulos para criação de usuário, operações CRUD de produtos, clientes e fornecedores, assim como registro de entrada e saída de produtos.

## Tecnologias e Bibliotecas

Este projeto foi construído usando Node.js e as seguintes bibliotecas:

- bcrypt: Utilizada para hash de senhas.
- bcryptjs: Uma versão JS do bcrypt para hashing de senha.
- cookie-parser: Middleware para parsear cookies.
- ejs: Motor de template para gerar HTML com JavaScript.
- express: Framework para aplicativos web.
- express-session: Middleware de sessão para Express.
- jsonwebtoken: Implementação de JSON Web Tokens.
- method-override: Permite o uso de verbos HTTP como PUT ou DELETE.
- pg: Cliente PostgreSQL para Node.js.
- pg-hstore: Serializador e desserializador para JSON com armazenamento hstore do PostgreSQL.
- sequelize: ORM para Node.js baseado em promessas.

O banco de dados é PostgreSQL.

## Estrutura do Projeto

O código fonte está dentro da pasta `src`, que inclui:

- `config`: Configurações de conexão com o banco de dados e outras variáveis globais.
- `controllers`: Lógica de controle entre o modelo e as views.
- `models`: Modelos representando as tabelas do banco de dados usando Sequelize.
- `routes`: Definição das rotas do aplicativo e seus middlewares.
- `views`: Templates EJS que são renderizados e enviados como HTML.

## Inicialização

Para colocar o projeto em funcionamento, siga estes passos:

1. Clone o repositório em sua máquina.
2. Instale as dependências com `npm install`.
3. Crie o banco de dados no PostgreSQL e execute os scripts SQL encontrados na pasta `db`.
4. Configure o arquivo na pasta `config` com suas variáveis de ambiente.
5. Inicie o servidor de desenvolvimento com `npm run dev` (assumindo que você tem o Nodemon instalado).

Lembre-se de configurar o arquivo `.env` na raiz do projeto com as variáveis necessárias para o banco de dados e autenticação.

## Contribuição

Este projeto é aberto para quem deseja contribuir. Se você está aprendendo a codificar, sinta-se à vontade para usar este projeto como uma base de estudo.