const NoticiasService = require('../services/NoticiasService');
const EventosService = require('../services/EventosService');
const OportunidadesService = require('../services/OportunidadesService');
const VagasService = require('../services/VagasService');
const InformacoesService = require('../services/InformacoesService');

// Instanciar services
const noticiasService = new NoticiasService();
const eventosService = new EventosService();
const oportunidadesService = new OportunidadesService();
const vagasService = new VagasService();
const informacoesService = new InformacoesService();

/**
 * Controller para rotas públicas (sem autenticação)
 * Apenas visualização de conteúdo
 */

/**
 * GET /public/home - Página inicial pública
 */
exports.home = async (req, res) => {
  try {
    // Buscar últimas notícias e eventos para exibir na home
    const noticias = await noticiasService.listar();
    const eventos = await eventosService.listar();
    
    // Pegar apenas os 3 mais recentes de cada
    const noticiasRecentes = noticias.slice(0, 3);
    const eventosProximos = eventos.slice(0, 3);

    res.render('public/home', {
      noticias: noticiasRecentes,
      eventos: eventosProximos,
      user: req.session?.user || null
    });
  } catch (error) {
    console.error('Erro ao carregar home:', error);
    res.status(500).render('error', {
      message: 'Erro ao carregar página inicial',
      user: req.session?.user || null
    });
  }
};

/**
 * GET /public/noticias - Listar todas as notícias
 */
exports.listarNoticias = async (req, res) => {
  try {
    const noticias = await noticiasService.listar();
    res.render('public/noticias', {
      noticias,
      user: req.session?.user || null
    });
  } catch (error) {
    console.error('Erro ao listar notícias:', error);
    res.status(500).render('error', {
      message: 'Erro ao carregar notícias',
      user: req.session?.user || null
    });
  }
};

/**
 * GET /public/noticias/:id - Detalhes de uma notícia
 */
exports.detalheNoticia = async (req, res) => {
  try {
    const noticia = await noticiasService.obter(req.params.id);
    if (!noticia) {
      return res.status(404).render('error', {
        message: 'Notícia não encontrada',
        user: req.session?.user || null
      });
    }
    res.render('public/noticia-detalhe', {
      noticia,
      user: req.session?.user || null
    });
  } catch (error) {
    console.error('Erro ao carregar notícia:', error);
    res.status(500).render('error', {
      message: 'Erro ao carregar notícia',
      user: req.session?.user || null
    });
  }
};

/**
 * GET /public/eventos - Listar todos os eventos
 */
exports.listarEventos = async (req, res) => {
  try {
    const eventos = await eventosService.listar();
    res.render('public/eventos', {
      eventos,
      user: req.session?.user || null
    });
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).render('error', {
      message: 'Erro ao carregar eventos',
      user: req.session?.user || null
    });
  }
};

/**
 * GET /public/eventos/:id - Detalhes de um evento
 */
exports.detalheEvento = async (req, res) => {
  try {
    const evento = await eventosService.obter(req.params.id);
    if (!evento) {
      return res.status(404).render('error', {
        message: 'Evento não encontrado',
        user: req.session?.user || null
      });
    }
    res.render('public/evento-detalhe', {
      evento,
      user: req.session?.user || null
    });
  } catch (error) {
    console.error('Erro ao carregar evento:', error);
    res.status(500).render('error', {
      message: 'Erro ao carregar evento',
      user: req.session?.user || null
    });
  }
};

/**
 * GET /public/oportunidades - Listar todas as oportunidades
 */
exports.listarOportunidades = async (req, res) => {
  try {
    const oportunidades = await oportunidadesService.listarComRelacionamentos();
    res.render('public/oportunidades', {
      oportunidades,
      user: req.session?.user || null
    });
  } catch (error) {
    console.error('Erro ao listar oportunidades:', error);
    res.status(500).render('error', {
      message: 'Erro ao carregar oportunidades',
      user: req.session?.user || null
    });
  }
};

/**
 * GET /public/vagas - Listar todas as vagas
 */
exports.listarVagas = async (req, res) => {
  try {
    const vagas = await vagasService.listar();
    res.render('public/vagas', {
      vagas,
      user: req.session?.user || null
    });
  } catch (error) {
    console.error('Erro ao listar vagas:', error);
    res.status(500).render('error', {
      message: 'Erro ao carregar vagas',
      user: req.session?.user || null
    });
  }
};

/**
 * GET /public/informacoes - Informações da universidade
 */
exports.informacoes = async (req, res) => {
  try {
    const informacoes = await informacoesService.listar();
    res.render('public/informacoes', {
      informacoes,
      user: req.session?.user || null
    });
  } catch (error) {
    console.error('Erro ao carregar informações:', error);
    res.status(500).render('error', {
      message: 'Erro ao carregar informações',
      user: req.session?.user || null
    });
  }
};
