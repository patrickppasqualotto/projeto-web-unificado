const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const Vaga = require(path.resolve(__dirname, '../../models/Vaga'))(sequelize, DataTypes);
const Vaga_Tags = require(path.resolve(__dirname, '../../models/Vaga_Tags'))(sequelize, DataTypes);
const Tags = require(path.resolve(__dirname, '../../models/Tags'))(sequelize, DataTypes);
const Categoria_vaga = require(path.resolve(__dirname, '../../models/Categoria_vaga'))(sequelize, DataTypes);
const Usuario = require(path.resolve(__dirname, '../../models/Usuario'))(sequelize, DataTypes);
const { validationResult } = require('express-validator');

// Configurar relacionamentos
Vaga.belongsToMany(Tags, { through: Vaga_Tags, foreignKey: 'id_vaga', otherKey: 'id_tag' });
Tags.belongsToMany(Vaga, { through: Vaga_Tags, foreignKey: 'id_tag', otherKey: 'id_vaga' });
Vaga.belongsTo(Categoria_vaga, { foreignKey: 'id_categoria' });
Vaga.belongsTo(Usuario, { foreignKey: 'id_usuario_publicador', as: 'publicador' });

// GET /vagas - Listar todas as vagas
exports.index = async (req, res) => {
  try {
    const vagas = await Vaga.findAll({
      include: [
        { model: Categoria_vaga, attributes: ['nome'] },
        { model: Usuario, as: 'publicador', attributes: ['nome'] },
        { model: Tags, attributes: ['id_tag', 'nome'], through: { attributes: [] } }
      ],
      order: [['data_publicacao', 'DESC']],
    });
    res.render('vagas/index', { 
      vagas, 
      title: 'Vagas',
      user: req.session.user,
      session: req.session
    });
  } catch (error) {
    console.error('Erro ao listar vagas:', error);
    res.status(500).render('error', { message: 'Erro ao carregar vagas' });
  }
};

// GET /vagas/new - Formulário de criação
exports.new = async (req, res) => {
  try {
    const categorias = await Categoria_vaga.findAll({ order: [['nome', 'ASC']] });
    const tags = await Tags.findAll({ order: [['nome', 'ASC']] });
    
    res.render('vagas/form', {
      title: 'Nova Vaga',
      vaga: null,
      categorias,
      tags,
      selectedTags: [],
      errors: [],
      action: '/vagas',
      method: 'POST',
    });
  } catch (error) {
    console.error('Erro ao exibir formulário:', error);
    res.status(500).render('error', { message: 'Erro ao carregar formulário' });
  }
};

// GET /vagas/:id - Visualizar vaga
exports.show = async (req, res) => {
  try {
    const vaga = await Vaga.findByPk(req.params.id, {
      include: [
        { model: Categoria_vaga, attributes: ['nome'] },
        { model: Usuario, as: 'publicador', attributes: ['nome', 'email'] },
        { model: Tags, attributes: ['id_tag', 'nome'], through: { attributes: [] } }
      ]
    });
    
    if (!vaga) {
      return res.status(404).render('error', { message: 'Vaga não encontrada' });
    }
    
    res.render('vagas/show', { vaga, title: `Vaga: ${vaga.titulo}` });
  } catch (error) {
    console.error('Erro ao buscar vaga:', error);
    res.status(500).render('error', { message: 'Erro ao carregar vaga' });
  }
};

// GET /vagas/:id/edit - Formulário de edição
exports.edit = async (req, res) => {
  try {
    const vaga = await Vaga.findByPk(req.params.id, {
      include: [
        { model: Tags, attributes: ['id_tag', 'nome'], through: { attributes: [] } }
      ]
    });
    
    if (!vaga) {
      return res.status(404).render('error', { message: 'Vaga não encontrada' });
    }
    
    const categorias = await Categoria_vaga.findAll({ order: [['nome', 'ASC']] });
    const tags = await Tags.findAll({ order: [['nome', 'ASC']] });
    const selectedTags = vaga.Tags.map(t => t.id_tag);
    
    res.render('vagas/form', {
      title: `Editar Vaga: ${vaga.titulo}`,
      vaga,
      categorias,
      tags,
      selectedTags,
      errors: [],
      action: `/vagas/${vaga.id_vaga}`,
      method: 'PUT',
    });
  } catch (error) {
    console.error('Erro ao exibir formulário de edição:', error);
    res.status(500).render('error', { message: 'Erro ao carregar formulário' });
  }
};

// POST /vagas - Criar nova vaga
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const categorias = await Categoria_vaga.findAll({ order: [['nome', 'ASC']] });
    const tags = await Tags.findAll({ order: [['nome', 'ASC']] });
    const selectedTags = req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : [];
    
    return res.status(400).render('vagas/form', {
      title: 'Nova Vaga',
      vaga: req.body,
      categorias,
      tags,
      selectedTags,
      errors: errors.array(),
      action: '/vagas',
      method: 'POST',
    });
  }

  try {
    const vaga = await Vaga.create({
      titulo: req.body.titulo.trim(),
      descricao: req.body.descricao.trim(),
      requisitos: req.body.requisitos.trim(),
      data_expiracao: req.body.data_expiracao,
      id_categoria: req.body.id_categoria,
      id_usuario_publicador: req.session.user.id_usuario,
      nome_empresa: req.body.nome_empresa ? req.body.nome_empresa.trim() : null,
      localizacao: req.body.localizacao ? req.body.localizacao.trim() : null,
      salario: req.body.salario ? parseFloat(req.body.salario) : null,
      url: req.body.url ? req.body.url.trim() : null,
    });

    // Adicionar tags
    if (req.body.tags) {
      const tagsArray = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
      for (const tagId of tagsArray) {
        await Vaga_Tags.create({
          id_vaga: vaga.id_vaga,
          id_tag: parseInt(tagId)
        });
      }
    }

    req.session.message = {
      type: 'success',
      text: `Vaga "${vaga.titulo}" criada com sucesso!`,
    };
    res.redirect(`/vagas/${vaga.id_vaga}`);
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    const categorias = await Categoria_vaga.findAll({ order: [['nome', 'ASC']] });
    const tags = await Tags.findAll({ order: [['nome', 'ASC']] });
    
    return res.status(400).render('vagas/form', {
      title: 'Nova Vaga',
      vaga: req.body,
      categorias,
      tags,
      selectedTags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : [],
      errors: [{ msg: 'Erro ao criar vaga. Tente novamente.' }],
      action: '/vagas',
      method: 'POST',
    });
  }
};

// PUT /vagas/:id - Atualizar vaga
exports.update = async (req, res) => {
  const errors = validationResult(req);
  const vaga = await Vaga.findByPk(req.params.id, {
    include: [{ model: Tags, attributes: ['id_tag', 'nome'], through: { attributes: [] } }]
  });

  if (!vaga) {
    return res.status(404).render('error', { message: 'Vaga não encontrada' });
  }

  if (!errors.isEmpty()) {
    const categorias = await Categoria_vaga.findAll({ order: [['nome', 'ASC']] });
    const tags = await Tags.findAll({ order: [['nome', 'ASC']] });
    const selectedTags = req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : [];
    
    return res.status(400).render('vagas/form', {
      title: `Editar Vaga: ${vaga.titulo}`,
      vaga: { ...vaga.toJSON(), ...req.body },
      categorias,
      tags,
      selectedTags,
      errors: errors.array(),
      action: `/vagas/${vaga.id_vaga}`,
      method: 'PUT',
    });
  }

  try {
    await vaga.update({
      titulo: req.body.titulo.trim(),
      descricao: req.body.descricao.trim(),
      requisitos: req.body.requisitos.trim(),
      data_expiracao: req.body.data_expiracao,
      id_categoria: req.body.id_categoria,
      nome_empresa: req.body.nome_empresa ? req.body.nome_empresa.trim() : null,
      localizacao: req.body.localizacao ? req.body.localizacao.trim() : null,
      salario: req.body.salario ? parseFloat(req.body.salario) : null,
      url: req.body.url ? req.body.url.trim() : null,
    });

    // Atualizar tags
    await Vaga_Tags.destroy({ where: { id_vaga: vaga.id_vaga } });
    if (req.body.tags) {
      const tagsArray = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
      for (const tagId of tagsArray) {
        await Vaga_Tags.create({
          id_vaga: vaga.id_vaga,
          id_tag: parseInt(tagId)
        });
      }
    }

    req.session.message = {
      type: 'success',
      text: `Vaga "${vaga.titulo}" atualizada com sucesso!`,
    };
    res.redirect(`/vagas/${vaga.id_vaga}`);
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error);
    const categorias = await Categoria_vaga.findAll({ order: [['nome', 'ASC']] });
    const tags = await Tags.findAll({ order: [['nome', 'ASC']] });
    
    return res.status(400).render('vagas/form', {
      title: `Editar Vaga: ${vaga.titulo}`,
      vaga: vaga.toJSON(),
      categorias,
      tags,
      selectedTags: vaga.Tags.map(t => t.id_tag),
      errors: [{ msg: 'Erro ao atualizar vaga. Tente novamente.' }],
      action: `/vagas/${vaga.id_vaga}`,
      method: 'PUT',
    });
  }
};

// DELETE /vagas/:id - Deletar vaga
exports.delete = async (req, res) => {
  try {
    const vaga = await Vaga.findByPk(req.params.id);
    if (!vaga) {
      return res.status(404).render('error', { message: 'Vaga não encontrada' });
    }

    const vagaTitulo = vaga.titulo;
    await Vaga_Tags.destroy({ where: { id_vaga: vaga.id_vaga } });
    await vaga.destroy();
    
    req.session.message = {
      type: 'success',
      text: `Vaga "${vagaTitulo}" deletada com sucesso!`,
    };
    res.redirect('/vagas');
  } catch (error) {
    console.error('Erro ao deletar vaga:', error);
    req.session.message = {
      type: 'error',
      text: 'Erro ao deletar vaga. Tente novamente.',
    };
    res.redirect('/vagas');
  }
};
