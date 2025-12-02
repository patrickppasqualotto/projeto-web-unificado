const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Portal Acadêmico UTFPR',
      version: '1.0.0',
      description: `
        - **Admin:** admin@test.com / admi!062025
        - **Usuário:** usuario@test.com / user123
      `,
      contact: {
        name: 'Suporte API',
        email: 'api@utfpr.edu.br'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor Alternativo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no login. Formato: Bearer {token}'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Erro ao processar requisição'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints de login e validação de token JWT'
      },
      {
        name: 'Notícias',
        description: 'CRUD completo de notícias acadêmicas'
      },
      {
        name: 'Eventos',
        description: 'Gerenciamento de eventos institucionais'
      },
      {
        name: 'Vagas',
        description: 'Vagas de estágio e emprego com tags (N:N)'
      },
      {
        name: 'Oportunidades',
        description: 'Oportunidades acadêmicas (bolsas, pesquisa, extensão)'
      },
      {
        name: 'Informações',
        description: 'Informações institucionais e contatos'
      },
      {
        name: 'Tags',
        description: 'Gerenciamento de tags para classificação de vagas'
      },
      {
        name: 'Categorias',
        description: 'Categorias de vagas (estágio, emprego, etc.)'
      }
    ]
  },
  apis: [
    './api/routes/auth.js',
    './api/routes/noticias.js',
    './api/routes/eventos.js',
    './api/routes/vagas.js',
    './api/routes/oportunidades.js',
    './api/routes/informacoes.js',
    './api/routes/tags.js',
    './api/routes/categoriavaga.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
