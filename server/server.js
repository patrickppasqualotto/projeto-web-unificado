// Load root .env so Configuracao/database.js picks up the same env vars
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

// MVC Routes
const authRoutes = require('./routes/auth');
const webAuthRoutes = require('./routes/webAuth');
const publicRoutes = require('./routes/public');
const tagsRoutes = require('./routes/tags');
const categoriavagaRoutes = require('./routes/categoria-vaga');
const vagasRoutes = require('./routes/vagas');
const eventosRoutes = require('./routes/eventos');
const noticiasRoutes = require('./routes/noticias');
const oportunidadesRoutes = require('./routes/oportunidades');
const informacoesRoutes = require('./routes/informacoes');

// API Routes (v1)
const apiAuthRoutes = require('./api/routes/auth');
const apiTagsRoutes = require('./api/routes/tags');
const apiCategoriaVagaRoutes = require('./api/routes/categoriavaga');
const apiVagasRoutes = require('./api/routes/vagas');
const apiEventosRoutes = require('./api/routes/eventos');
const apiNoticiasRoutes = require('./api/routes/noticias');
const apiOportunidadesRoutes = require('./api/routes/oportunidades');
const apiInformacoesRoutes = require('./api/routes/informacoes');

const { testarConexao } = require('../Configuracao/database');
const { messageMiddleware } = require('./utils/messageHandler');
const { errorMiddleware } = require('./utils/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

// Configurar layouts com EJS
app.use(expressLayouts);
app.set('layout', 'layout'); // Usa views/layout.ejs como layout padrão
app.set('layout extractScripts', true); // Extrai scripts para o final
app.set('layout extractStyles', true); // Extrai estilos para o head

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Query string: ?_method=PUT
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
})); // Body: <input name="_method" value="PUT">

// Middleware de mensagens (disponibilizar em views)
app.use(messageMiddleware);

// Session configuration (persistido em Postgres)
const sessionConfig = {
  store: new PgSession({
    conString: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    createTableIfMissing: true // criar tabela automaticamente se não existir
  }),
  secret: process.env.SESSION_SECRET || 'troque_para_uma_chave_secreta_em_producao',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 8 * 60 * 60 * 1000, // 8 horas
    httpOnly: true,
    secure: false, // mude para true se usar HTTPS em produção
    sameSite: 'lax'
  }
};

app.use(session(sessionConfig));

// Middleware global para injetar variáveis em todas as views
app.use((req, res, next) => {
  // Disponibilizar variáveis globais em todas as views
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.user?.id_perfil === 2 || false;
  res.locals.session = req.session;
  res.locals.title = res.locals.title || 'Portal Acadêmico UTFPR';
  next();
});

// Rotas públicas (sem autenticação)
app.use('/public', publicRoutes);

// Documentação Swagger da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Portal UTFPR - Documentação',
  customfavIcon: 'https://www.utfpr.edu.br/favicon.ico'
}));

// Rotas de autenticação
app.use('/auth', authRoutes);              // API (JSON + JWT)
app.use('/web', webAuthRoutes);            // MVC (HTML + sessão)

// Rotas MVC Admin (CRUD - protegidas)
app.use('/tags', tagsRoutes);              // MVC Tags CRUD
app.use('/categoria-vaga', categoriavagaRoutes);  // MVC Categorias CRUD
app.use('/vagas', vagasRoutes);            // MVC Vagas CRUD
app.use('/eventos', eventosRoutes);        // MVC Eventos CRUD
app.use('/noticias', noticiasRoutes);      // MVC Notícias CRUD
app.use('/oportunidades', oportunidadesRoutes);  // MVC Oportunidades CRUD
app.use('/informacoes', informacoesRoutes); // MVC Informações CRUD

// API v1 Routes (JSON + JWT)
app.use('/api/v1/auth', apiAuthRoutes);
app.use('/api/v1/tags', apiTagsRoutes);
app.use('/api/v1/categoria-vaga', apiCategoriaVagaRoutes);
app.use('/api/v1/vagas', apiVagasRoutes);
app.use('/api/v1/eventos', apiEventosRoutes);
app.use('/api/v1/noticias', apiNoticiasRoutes);
app.use('/api/v1/oportunidades', apiOportunidadesRoutes);
app.use('/api/v1/informacoes', apiInformacoesRoutes);

// Rota raiz (redireciona para home pública)
app.get('/', (req, res) => {
  res.redirect('/public/home');
});

// Middleware de tratamento global de erros (deve ser o último)
app.use(errorMiddleware);

const PORT = process.env.PORT_SERVER || 4000;

testarConexao().then(() => {
  app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
}).catch((err) => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});
