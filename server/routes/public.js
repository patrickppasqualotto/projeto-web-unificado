const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

/**
 * Rotas públicas (sem autenticação necessária)
 * Apenas visualização de conteúdo
 */

// Página inicial
router.get('/home', publicController.home);

// Notícias
router.get('/noticias', publicController.listarNoticias);
router.get('/noticias/:id', publicController.detalheNoticia);

// Eventos
router.get('/eventos', publicController.listarEventos);
router.get('/eventos/:id', publicController.detalheEvento);

// Oportunidades acadêmicas
router.get('/oportunidades', publicController.listarOportunidades);

// Vagas de estágio/emprego
router.get('/vagas', publicController.listarVagas);

// Informações da universidade
router.get('/informacoes', publicController.informacoes);

module.exports = router;
