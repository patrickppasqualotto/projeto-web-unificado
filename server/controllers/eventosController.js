const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const Evento = require(path.resolve(__dirname, '../../models/Evento'))(sequelize, DataTypes);
const Usuario = require(path.resolve(__dirname, '../../models/Usuario'))(sequelize, DataTypes);
const Curso = require(path.resolve(__dirname, '../../models/Curso'))(sequelize, DataTypes);
const { validationResult } = require('express-validator');

// Configurar relacionamentos
Evento.belongsTo(Usuario, { foreignKey: 'id_organizador', as: 'organizador' });
Evento.belongsTo(Curso, { foreignKey: 'id_curso', as: 'curso' });

// GET /eventos - Listar todos os eventos
exports.index = async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      include: [
        { model: Usuario, as: 'organizador', attributes: ['nome', 'email'] },
        { model: Curso, as: 'curso', attributes: ['nome'] }
      ],
      order: [['data_inicio', 'DESC']],
    });
    res.render('eventos/index', { 
      eventos, 
      title: 'Eventos',
      user: req.session.user,
      session: req.session
    });
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).render('error', { message: 'Erro ao carregar eventos' });
  }
};

// GET /eventos/new - Formulário de criação
exports.new = async (req, res) => {
  try {
    const cursos = await Curso.findAll({ order: [['nome', 'ASC']] });
    
    res.render('eventos/form', {
      title: 'Novo Evento',
      evento: null,
      cursos,
      errors: [],
      action: '/eventos',
      method: 'POST',
    });
  } catch (error) {
    console.error('Erro ao exibir formulário:', error);
    res.status(500).render('error', { message: 'Erro ao carregar formulário' });
  }
};

// GET /eventos/:id - Visualizar evento
exports.show = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'organizador', attributes: ['nome', 'email'] },
        { model: Curso, as: 'curso', attributes: ['nome'] }
      ]
    });
    
    if (!evento) {
      return res.status(404).render('error', { message: 'Evento não encontrado' });
    }
    
    res.render('eventos/show', { evento, title: `Evento: ${evento.titulo}` });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).render('error', { message: 'Erro ao carregar evento' });
  }
};

// GET /eventos/:id/edit - Formulário de edição
exports.edit = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    
    if (!evento) {
      return res.status(404).render('error', { message: 'Evento não encontrado' });
    }
    
    const cursos = await Curso.findAll({ order: [['nome', 'ASC']] });
    
    res.render('eventos/form', {
      title: `Editar Evento: ${evento.titulo}`,
      evento,
      cursos,
      errors: [],
      action: `/eventos/${evento.id_evento}`,
      method: 'PUT',
    });
  } catch (error) {
    console.error('Erro ao exibir formulário de edição:', error);
    res.status(500).render('error', { message: 'Erro ao carregar formulário' });
  }
};

// POST /eventos - Criar novo evento
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const cursos = await Curso.findAll({ order: [['nome', 'ASC']] });
    return res.status(400).render('eventos/form', {
      title: 'Novo Evento',
      evento: req.body,
      cursos,
      errors: errors.array(),
      action: '/eventos',
      method: 'POST',
    });
  }

  try {
    const evento = await Evento.create({
      titulo: req.body.titulo.trim(),
      descricao: req.body.descricao.trim(),
      data_inicio: req.body.data_inicio,
      data_fim: req.body.data_fim ? req.body.data_fim : null,
      local_evento: req.body.local_evento.trim(),
      link_inscricao: req.body.link_inscricao ? req.body.link_inscricao.trim() : null,
      id_organizador: req.session.user.id_usuario,
      id_curso: req.body.id_curso && req.body.id_curso !== '' ? req.body.id_curso : null,
    });

    req.session.message = {
      type: 'success',
      text: `Evento "${evento.titulo}" criado com sucesso!`,
    };
    res.redirect(`/eventos/${evento.id_evento}`);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    const cursos = await Curso.findAll({ order: [['nome', 'ASC']] });
    
    return res.status(400).render('eventos/form', {
      title: 'Novo Evento',
      evento: req.body,
      cursos,
      errors: [{ msg: 'Erro ao criar evento. Tente novamente.' }],
      action: '/eventos',
      method: 'POST',
    });
  }
};

// PUT /eventos/:id - Atualizar evento
exports.update = async (req, res) => {
  const errors = validationResult(req);
  const evento = await Evento.findByPk(req.params.id);

  if (!evento) {
    return res.status(404).render('error', { message: 'Evento não encontrado' });
  }

  if (!errors.isEmpty()) {
    const cursos = await Curso.findAll({ order: [['nome', 'ASC']] });
    return res.status(400).render('eventos/form', {
      title: `Editar Evento: ${evento.titulo}`,
      evento: { ...evento.toJSON(), ...req.body },
      cursos,
      errors: errors.array(),
      action: `/eventos/${evento.id_evento}`,
      method: 'PUT',
    });
  }

  try {
    await evento.update({
      titulo: req.body.titulo.trim(),
      descricao: req.body.descricao.trim(),
      data_inicio: req.body.data_inicio,
      data_fim: req.body.data_fim ? req.body.data_fim : null,
      local_evento: req.body.local_evento.trim(),
      link_inscricao: req.body.link_inscricao ? req.body.link_inscricao.trim() : null,
      id_curso: req.body.id_curso && req.body.id_curso !== '' ? req.body.id_curso : null,
    });

    req.session.message = {
      type: 'success',
      text: `Evento "${evento.titulo}" atualizado com sucesso!`,
    };
    res.redirect(`/eventos/${evento.id_evento}`);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    const cursos = await Curso.findAll({ order: [['nome', 'ASC']] });
    
    return res.status(400).render('eventos/form', {
      title: `Editar Evento: ${evento.titulo}`,
      evento: evento.toJSON(),
      cursos,
      errors: [{ msg: 'Erro ao atualizar evento. Tente novamente.' }],
      action: `/eventos/${evento.id_evento}`,
      method: 'PUT',
    });
  }
};

// DELETE /eventos/:id - Deletar evento
exports.delete = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) {
      return res.status(404).render('error', { message: 'Evento não encontrado' });
    }

    const eventoTitulo = evento.titulo;
    await evento.destroy();
    
    req.session.message = {
      type: 'success',
      text: `Evento "${eventoTitulo}" deletado com sucesso!`,
    };
    res.redirect('/eventos');
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    req.session.message = {
      type: 'error',
      text: 'Erro ao deletar evento. Tente novamente.',
    };
    res.redirect('/eventos');
  }
};
