const { Oportunidade, TipoOportunidade } = require('../../models');

// MVC CRUD Methods

// INDEX - Listar todas as oportunidades
exports.index = async (req, res) => {
  try {
    const oportunidades = await Oportunidade.findAll({
      include: [
        {
          model: TipoOportunidade,
          as: 'tipoOportunidade',
          attributes: ['id_tipo_oportunidade', 'nome']
        }
      ],
      order: [['data_publicacao', 'DESC']]
    });

    res.render('oportunidades/index', {
      title: 'Oportunidades',
      oportunidades,
      user: req.session.user,
      session: req.session
    });
  } catch (error) {
    console.error('Erro ao listar oportunidades:', error);
    res.status(500).render('error', { error: 'Erro ao listar oportunidades' });
  }
};

// NEW - Formulário para criar nova oportunidade
exports.new = async (req, res) => {
  try {
    const tipos = await TipoOportunidade.findAll({
      attributes: ['id_tipo_oportunidade', 'nome'],
      order: [['nome', 'ASC']]
    });

    res.render('oportunidades/form', {
      title: 'Nova Oportunidade',
      oportunidade: {},
      tipos,
      isEdit: false,
      errors: []
    });
  } catch (error) {
    console.error('Erro ao renderizar formulário:', error);
    res.status(500).render('error', { error: 'Erro ao acessar formulário' });
  }
};

// SHOW - Exibir detalhes de uma oportunidade
exports.show = async (req, res) => {
  try {
    const oportunidade = await Oportunidade.findByPk(req.params.id, {
      include: [
        {
          model: TipoOportunidade,
          as: 'tipoOportunidade',
          attributes: ['id_tipo_oportunidade', 'nome']
        }
      ]
    });

    if (!oportunidade) {
      return res.status(404).render('error', { error: 'Oportunidade não encontrada' });
    }

    res.render('oportunidades/show', {
      title: oportunidade.titulo,
      oportunidade,
      session: req.session
    });
  } catch (error) {
    console.error('Erro ao buscar oportunidade:', error);
    res.status(500).render('error', { error: 'Erro ao buscar oportunidade' });
  }
};

// EDIT - Formulário para editar oportunidade
exports.edit = async (req, res) => {
  try {
    const oportunidade = await Oportunidade.findByPk(req.params.id);

    if (!oportunidade) {
      return res.status(404).render('error', { error: 'Oportunidade não encontrada' });
    }

    const tipos = await TipoOportunidade.findAll({
      attributes: ['id_tipo_oportunidade', 'nome'],
      order: [['nome', 'ASC']]
    });

    res.render('oportunidades/form', {
      title: `Editar Oportunidade: ${oportunidade.titulo}`,
      oportunidade,
      tipos,
      isEdit: true,
      errors: []
    });
  } catch (error) {
    console.error('Erro ao buscar oportunidade para editar:', error);
    res.status(500).render('error', { error: 'Erro ao acessar edição' });
  }
};

// CREATE - Salvar nova oportunidade
exports.create = async (req, res) => {
  const { titulo, descricao, data_prazo, id_tipo_oportunidade, link } = req.body;

  try {
    // Validação no controller (como backup)
    if (!titulo || titulo.trim().length < 5 || titulo.trim().length > 200) {
      const tipos = await TipoOportunidade.findAll();
      return res.status(400).render('oportunidades/form', {
        title: 'Nova Oportunidade',
        oportunidade: req.body,
        tipos,
        isEdit: false,
        errors: [{ msg: 'Título deve ter entre 5 e 200 caracteres' }]
      });
    }

    if (!descricao || descricao.trim().length < 10 || descricao.trim().length > 3000) {
      const tipos = await TipoOportunidade.findAll();
      return res.status(400).render('oportunidades/form', {
        title: 'Nova Oportunidade',
        oportunidade: req.body,
        tipos,
        isEdit: false,
        errors: [{ msg: 'Descrição deve ter entre 10 e 3000 caracteres' }]
      });
    }

    if (!id_tipo_oportunidade) {
      const tipos = await TipoOportunidade.findAll();
      return res.status(400).render('oportunidades/form', {
        title: 'Nova Oportunidade',
        oportunidade: req.body,
        tipos,
        isEdit: false,
        errors: [{ msg: 'Selecione um tipo de oportunidade' }]
      });
    }

    // Validar se tipo existe
    const tipo = await TipoOportunidade.findByPk(id_tipo_oportunidade);
    if (!tipo) {
      const tipos = await TipoOportunidade.findAll();
      return res.status(400).render('oportunidades/form', {
        title: 'Nova Oportunidade',
        oportunidade: req.body,
        tipos,
        isEdit: false,
        errors: [{ msg: 'Tipo de oportunidade inválido' }]
      });
    }

    const oportunidade = await Oportunidade.create({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      data_prazo: data_prazo || null,
      id_tipo_oportunidade,
      link: link || null,
      data_publicacao: new Date()
    });

    req.session.message = {
      type: 'success',
      text: `✅ Oportunidade "${oportunidade.titulo}" criada com sucesso!`
    };

    res.redirect(`/oportunidades/${oportunidade.id_oportunidade}`);
  } catch (error) {
    console.error('Erro ao criar oportunidade:', error);
    const tipos = await TipoOportunidade.findAll();
    res.status(500).render('oportunidades/form', {
      title: 'Nova Oportunidade',
      oportunidade: req.body,
      tipos,
      isEdit: false,
      errors: [{ msg: 'Erro ao criar oportunidade. Tente novamente.' }]
    });
  }
};

// UPDATE - Atualizar oportunidade
exports.update = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, data_prazo, id_tipo_oportunidade, link } = req.body;

  try {
    const oportunidade = await Oportunidade.findByPk(id);

    if (!oportunidade) {
      return res.status(404).render('error', { error: 'Oportunidade não encontrada' });
    }

    // Validação
    if (!titulo || titulo.trim().length < 5 || titulo.trim().length > 200) {
      const tipos = await TipoOportunidade.findAll();
      return res.status(400).render('oportunidades/form', {
        title: `Editar Oportunidade: ${oportunidade.titulo}`,
        oportunidade,
        tipos,
        isEdit: true,
        errors: [{ msg: 'Título deve ter entre 5 e 200 caracteres' }]
      });
    }

    if (!descricao || descricao.trim().length < 10 || descricao.trim().length > 3000) {
      const tipos = await TipoOportunidade.findAll();
      return res.status(400).render('oportunidades/form', {
        title: `Editar Oportunidade: ${oportunidade.titulo}`,
        oportunidade,
        tipos,
        isEdit: true,
        errors: [{ msg: 'Descrição deve ter entre 10 e 3000 caracteres' }]
      });
    }

    if (!id_tipo_oportunidade) {
      const tipos = await TipoOportunidade.findAll();
      return res.status(400).render('oportunidades/form', {
        title: `Editar Oportunidade: ${oportunidade.titulo}`,
        oportunidade,
        tipos,
        isEdit: true,
        errors: [{ msg: 'Selecione um tipo de oportunidade' }]
      });
    }

    const tipo = await TipoOportunidade.findByPk(id_tipo_oportunidade);
    if (!tipo) {
      const tipos = await TipoOportunidade.findAll();
      return res.status(400).render('oportunidades/form', {
        title: `Editar Oportunidade: ${oportunidade.titulo}`,
        oportunidade,
        tipos,
        isEdit: true,
        errors: [{ msg: 'Tipo de oportunidade inválido' }]
      });
    }

    await oportunidade.update({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      data_prazo: data_prazo || null,
      id_tipo_oportunidade,
      link: link || null
    });

    req.session.message = {
      type: 'success',
      text: `✅ Oportunidade "${oportunidade.titulo}" atualizada com sucesso!`
    };

    res.redirect(`/oportunidades/${oportunidade.id_oportunidade}`);
  } catch (error) {
    console.error('Erro ao atualizar oportunidade:', error);
    res.status(500).render('error', { error: 'Erro ao atualizar oportunidade' });
  }
};

// DELETE - Deletar oportunidade
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const oportunidade = await Oportunidade.findByPk(id);

    if (!oportunidade) {
      return res.status(404).render('error', { error: 'Oportunidade não encontrada' });
    }

    const titulo = oportunidade.titulo;
    await oportunidade.destroy();

    req.session.message = {
      type: 'success',
      text: `✅ Oportunidade "${titulo}" deletada com sucesso!`
    };

    res.redirect('/oportunidades');
  } catch (error) {
    console.error('Erro ao deletar oportunidade:', error);
    res.status(500).render('error', { error: 'Erro ao deletar oportunidade' });
  }
};
