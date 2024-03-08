# Sistema de Controle de Estoque Simples

Este é um sistema de controle de estoque simples desenvolvido com Node.js, Express.js e PostgreSQL. O sistema inclui módulos para criação de usuários, CRUD de produtos, clientes fornecedores, e controle de entrada e saída de produtos por pedido.

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- Sequelize

## Dependências

- bcrypt
- bcryptjs
- cookie-parser
- ejs
- express
- express-session
- jsonwebtoken
- method-override
- pg
- pg-hstore
- sequelize

## Configuração do Projeto

### Requisitos

- Node.js instalado na máquina
- PostgreSQL instalado na máquina

### Instalação

1. Clone este repositório para a sua máquina local.
   ```bash
   git clone https://github.com/seu-usuario/sistema-controle-estoque.git
   ```

2. Navegue até o diretório do projeto.
   ```bash
   cd sistema-controle-estoque
   ```

3. Instale as dependências do projeto.
   ```bash
   npm install
   ```

4. Configure o banco de dados PostgreSQL de acordo com suas credenciais no arquivo `config/database.js`.

5. Execute as migrações do Sequelize para criar as tabelas no banco de dados.
   ```bash
   npx sequelize-cli db:migrate
   ```

6. Inicie o servidor.
   ```bash
   npm start
   ```

7. Acesse o sistema através do seu navegador em [http://localhost:3000](http://localhost:3000).

## Contribuição

Este projeto foi desenvolvido para fins educativos e de estudos próprios, além de servir como material didático para alunos do SENAC. Contribuições são bem-vindas. Sinta-se à vontade para abrir um issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).