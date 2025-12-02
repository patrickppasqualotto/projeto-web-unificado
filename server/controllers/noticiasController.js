const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const Noticia = require(path.resolve(__dirname, '../../models/Noticia'))(sequelize, DataTypes);
const Usuario = require(path.resolve(__dirname, '../../models/Usuario'))(sequelize, DataTypes);
const { validationResult } = require('express-validator');

// Configurar relacionamentos
Noticia.belongsTo(Usuario, { foreignKey: 'id_autor', as: 'autor' });

// GET /noticias - Listar todas as notícias
exports.index = async (req, res) => {
  try {
    const noticias = await Noticia.findAll({
      include: [
        { model: Usuario, as: 'autor', attributes: ['nome', 'email'] }
      ],
      order: [['data_publicacao', 'DESC']],
    });
    res.render('noticias/index', { 
      noticias, 
      title: 'Notícias',
      user: req.session.user,
      session: req.session
    });
  } catch (error) {
    console.error('Erro ao listar notícias:', error);
    res.status(500).render('error', { message: 'Erro ao carregar notícias' });
  }
};

// GET /noticias/new - Formulário de criação
exports.new = async (req, res) => {
  try {
    res.render('noticias/form', {
      title: 'Nova Notícia',
      noticia: null,
      errors: [],
      action: '/noticias',
      method: 'POST',
    });
  } catch (error) {
    console.error('Erro ao exibir formulário:', error);
    res.status(500).render('error', { message: 'Erro ao carregar formulário' });
  }
};

// GET /noticias/:id - Visualizar notícia
exports.show = async (req, res) => {
  try {
    const noticia = await Noticia.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'autor', attributes: ['nome', 'email'] }
      ]
    });
    
    if (!noticia) {
      return res.status(404).render('error', { message: 'Notícia não encontrada' });
    }
    
    res.render('noticias/show', { noticia, title: `Notícia: ${noticia.titulo}` });
  } catch (error) {
    console.error('Erro ao buscar notícia:', error);
    res.status(500).render('error', { message: 'Erro ao carregar notícia' });
  }
};

// GET /noticias/:id/edit - Formulário de edição
exports.edit = async (req, res) => {
  try {
    const noticia = await Noticia.findByPk(req.params.id);
    
    if (!noticia) {
      return res.status(404).render('error', { message: 'Notícia não encontrada' });
    }
    
    res.render('noticias/form', {
      title: `Editar Notícia: ${noticia.titulo}`,
      noticia,
      errors: [],
      action: `/noticias/${noticia.id_noticia}`,
      method: 'PUT',
    });
  } catch (error) {
    console.error('Erro ao exibir formulário de edição:', error);
    res.status(500).render('error', { message: 'Erro ao carregar formulário' });
  }
};

// POST /noticias - Criar nova notícia
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('noticias/form', {
      title: 'Nova Notícia',
      noticia: req.body,
      errors: errors.array(),
      action: '/noticias',
      method: 'POST',
    });
  }

  try {
    const noticia = await Noticia.create({
      titulo: req.body.titulo.trim(),
      subtitulo: req.body.subtitulo ? req.body.subtitulo.trim() : null,
      conteudo: req.body.conteudo.trim(),
      imagem_url: req.body.imagem_url ? req.body.imagem_url.trim() : null,
      data_expiracao: req.body.data_expiracao ? req.body.data_expiracao : null,
      id_autor: req.session.user.id_usuario,
    });

    req.session.message = {
      type: 'success',
      text: `Notícia "${noticia.titulo}" criada com sucesso!`,
    };
    res.redirect(`/noticias/${noticia.id_noticia}`);
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    
    return res.status(400).render('noticias/form', {
      title: 'Nova Notícia',
      noticia: req.body,
      errors: [{ msg: 'Erro ao criar notícia. Tente novamente.' }],
      action: '/noticias',
      method: 'POST',
    });
  }
};

// PUT /noticias/:id - Atualizar notícia
exports.update = async (req, res) => {
  const errors = validationResult(req);
  const noticia = await Noticia.findByPk(req.params.id);

  if (!noticia) {
    return res.status(404).render('error', { message: 'Notícia não encontrada' });
  }

  if (!errors.isEmpty()) {
    return res.status(400).render('noticias/form', {
      title: `Editar Notícia: ${noticia.titulo}`,
      noticia: { ...noticia.toJSON(), ...req.body },
      errors: errors.array(),
      action: `/noticias/${noticia.id_noticia}`,
      method: 'PUT',
    });
  }

  try {
    await noticia.update({
      titulo: req.body.titulo.trim(),
      subtitulo: req.body.subtitulo ? req.body.subtitulo.trim() : null,
      conteudo: req.body.conteudo.trim(),
      imagem_url: req.body.imagem_url ? req.body.imagem_url.trim() : null,
      data_expiracao: req.body.data_expiracao ? req.body.data_expiracao : null,
    });

    req.session.message = {
      type: 'success',
      text: `Notícia "${noticia.titulo}" atualizada com sucesso!`,
    };
    res.redirect(`/noticias/${noticia.id_noticia}`);
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error);
    
    return res.status(400).render('noticias/form', {
      title: `Editar Notícia: ${noticia.titulo}`,
      noticia: noticia.toJSON(),
      errors: [{ msg: 'Erro ao atualizar notícia. Tente novamente.' }],
      action: `/noticias/${noticia.id_noticia}`,
      method: 'PUT',
    });
  }
};

// DELETE /noticias/:id - Deletar notícia
exports.delete = async (req, res) => {
  try {
    const noticia = await Noticia.findByPk(req.params.id);
    if (!noticia) {
      return res.status(404).render('error', { message: 'Notícia não encontrada' });
    }

    const noticiaTitulo = noticia.titulo;
    await noticia.destroy();
    
    req.session.message = {
      type: 'success',
      text: `Notícia "${noticiaTitulo}" deletada com sucesso!`,
    };
    res.redirect('/noticias');
  } catch (error) {
    console.error('Erro ao deletar notícia:', error);
    req.session.message = {
      type: 'error',
      text: 'Erro ao deletar notícia. Tente novamente.',
    };
    res.redirect('/noticias');
  }
};
