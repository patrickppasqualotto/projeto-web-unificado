const { Informacoes } = require('../../models');

// Listar todas as informações
exports.index = async (req, res) => {
  try {
    const informacoes = await Informacoes.findAll({ order: [['ultima_att', 'DESC']] });
    res.render('informacoes/index', { 
      title: 'Informações', 
      informacoes, 
      user: req.session.user,
      session: req.session 
    });
  } catch (err) {
    console.error('Erro ao listar Informações:', err);
    res.status(500).render('error', { error: 'Erro ao listar informações' });
  }
};

// Formulário nova
exports.new = async (req, res) => {
  res.render('informacoes/form', { title: 'Nova Informação', informacao: {}, isEdit: false, errors: [] });
};

// Mostrar uma informação
exports.show = async (req, res) => {
  try {
    const informacao = await Informacoes.findByPk(req.params.id);
    if (!informacao) return res.status(404).render('error', { error: 'Informação não encontrada' });
    res.render('informacoes/show', { title: informacao.titulo, informacao, session: req.session });
  } catch (err) {
    console.error('Erro ao buscar informação:', err);
    res.status(500).render('error', { error: 'Erro ao buscar informação' });
  }
};

// Formulário edição
exports.edit = async (req, res) => {
  try {
    const informacao = await Informacoes.findByPk(req.params.id);
    if (!informacao) return res.status(404).render('error', { error: 'Informação não encontrada' });
    res.render('informacoes/form', { title: `Editar: ${informacao.titulo}`, informacao, isEdit: true, errors: [] });
  } catch (err) {
    console.error('Erro ao acessar edição:', err);
    res.status(500).render('error', { error: 'Erro ao acessar edição' });
  }
};

// Criar
exports.create = async (req, res) => {
  const { chave, titulo, descricao } = req.body;
  try {
    // validação simples
    const errors = [];
    if (!chave || chave.trim().length < 2) errors.push({ msg: 'Chave deve ter pelo menos 2 caracteres' });
    if (!titulo || titulo.trim().length < 3) errors.push({ msg: 'Título deve ter pelo menos 3 caracteres' });
    if (!descricao || descricao.trim().length < 3) errors.push({ msg: 'Descrição muito curta' });

    if (errors.length > 0) {
      return res.status(400).render('informacoes/form', { title: 'Nova Informação', informacao: req.body, isEdit: false, errors });
    }

    const novo = await Informacoes.create({
      chave: chave.trim(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      ultima_att: new Date()
    });

    req.session.message = { type: 'success', text: `✅ Informação "${novo.titulo}" criada com sucesso!` };
    res.redirect(`/informacoes/${novo.id_informacoes}`);
  } catch (err) {
    console.error('Erro ao criar informação:', err);
    res.status(500).render('informacoes/form', { title: 'Nova Informação', informacao: req.body, isEdit: false, errors: [{ msg: 'Erro ao criar informação' }] });
  }
};

// Atualizar
exports.update = async (req, res) => {
  const { id } = req.params;
  const { chave, titulo, descricao } = req.body;
  try {
    const informacao = await Informacoes.findByPk(id);
    if (!informacao) return res.status(404).render('error', { error: 'Informação não encontrada' });

    // validação simples
    const errors = [];
    if (!chave || chave.trim().length < 2) errors.push({ msg: 'Chave deve ter pelo menos 2 caracteres' });
    if (!titulo || titulo.trim().length < 3) errors.push({ msg: 'Título deve ter pelo menos 3 caracteres' });
    if (!descricao || descricao.trim().length < 3) errors.push({ msg: 'Descrição muito curta' });

    if (errors.length > 0) {
      return res.status(400).render('informacoes/form', { title: `Editar: ${informacao.titulo}`, informacao: { ...informacao.toJSON(), ...req.body }, isEdit: true, errors });
    }

    await informacao.update({ chave: chave.trim(), titulo: titulo.trim(), descricao: descricao.trim(), ultima_att: new Date() });

    req.session.message = { type: 'success', text: `✅ Informação "${informacao.titulo}" atualizada com sucesso!` };
    res.redirect(`/informacoes/${informacao.id_informacoes}`);
  } catch (err) {
    console.error('Erro ao atualizar informação:', err);
    res.status(500).render('error', { error: 'Erro ao atualizar informação' });
  }
};

// Deletar
exports.delete = async (req, res) => {
  try {
    const informacao = await Informacoes.findByPk(req.params.id);
    if (!informacao) return res.status(404).render('error', { error: 'Informação não encontrada' });
    const titulo = informacao.titulo;
    await informacao.destroy();
    req.session.message = { type: 'success', text: `✅ Informação "${titulo}" deletada com sucesso!` };
    res.redirect('/informacoes');
  } catch (err) {
    console.error('Erro ao deletar informação:', err);
    res.status(500).render('error', { error: 'Erro ao deletar informação' });
  }
};
