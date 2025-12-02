const { Tags, Categoria_vaga, Vaga, Vaga_Tags, Evento, Noticia, Oportunidade, TipoOportunidade, Informacoes, Usuario, Curso } = require('../../../models');

// ========== TAGS ==========
exports.tags = {
  // GET /api/v1/tags
  list: async (req, res) => {
    try {
      const tags = await Tags.findAll({ order: [['nome', 'ASC']] });
      res.json({ success: true, data: tags });
    } catch (err) {
      console.error('Erro ao listar tags:', err);
      res.status(500).json({ success: false, error: 'Erro ao listar tags' });
    }
  },

  // GET /api/v1/tags/:id
  show: async (req, res) => {
    try {
      const tag = await Tags.findByPk(req.params.id);
      if (!tag) return res.status(404).json({ success: false, error: 'Tag não encontrada' });
      res.json({ success: true, data: tag });
    } catch (err) {
      console.error('Erro ao buscar tag:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar tag' });
    }
  },

  // POST /api/v1/tags
  create: async (req, res) => {
    const { nome } = req.body;
    try {
      if (!nome || nome.trim().length < 2 || nome.trim().length > 100) {
        return res.status(400).json({ success: false, error: 'Nome deve ter entre 2 e 100 caracteres' });
      }
      const tag = await Tags.create({ nome: nome.trim() });
      res.status(201).json({ success: true, data: tag, message: 'Tag criada com sucesso' });
    } catch (err) {
      console.error('Erro ao criar tag:', err);
      res.status(500).json({ success: false, error: 'Erro ao criar tag' });
    }
  },

  // PUT /api/v1/tags/:id
  update: async (req, res) => {
    const { nome } = req.body;
    try {
      const tag = await Tags.findByPk(req.params.id);
      if (!tag) return res.status(404).json({ success: false, error: 'Tag não encontrada' });
      if (!nome || nome.trim().length < 2 || nome.trim().length > 100) {
        return res.status(400).json({ success: false, error: 'Nome deve ter entre 2 e 100 caracteres' });
      }
      await tag.update({ nome: nome.trim() });
      res.json({ success: true, data: tag, message: 'Tag atualizada com sucesso' });
    } catch (err) {
      console.error('Erro ao atualizar tag:', err);
      res.status(500).json({ success: false, error: 'Erro ao atualizar tag' });
    }
  },

  // DELETE /api/v1/tags/:id
  delete: async (req, res) => {
    try {
      const tag = await Tags.findByPk(req.params.id);
      if (!tag) return res.status(404).json({ success: false, error: 'Tag não encontrada' });
      await tag.destroy();
      res.json({ success: true, message: 'Tag deletada com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar tag:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar tag' });
    }
  }
};

// ========== CATEGORIA_VAGA ==========
exports.categoriaVaga = {
  list: async (req, res) => {
    try {
      const cats = await Categoria_vaga.findAll({ order: [['nome', 'ASC']] });
      res.json({ success: true, data: cats });
    } catch (err) {
      console.error('Erro ao listar categorias:', err);
      res.status(500).json({ success: false, error: 'Erro ao listar categorias' });
    }
  },

  show: async (req, res) => {
    try {
      const cat = await Categoria_vaga.findByPk(req.params.id);
      if (!cat) return res.status(404).json({ success: false, error: 'Categoria não encontrada' });
      res.json({ success: true, data: cat });
    } catch (err) {
      console.error('Erro ao buscar categoria:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar categoria' });
    }
  },

  create: async (req, res) => {
    const { nome, descricao } = req.body;
    try {
      if (!nome || nome.trim().length < 2 || nome.trim().length > 100) {
        return res.status(400).json({ success: false, error: 'Nome deve ter entre 2 e 100 caracteres' });
      }
      const cat = await Categoria_vaga.create({ nome: nome.trim(), descricao: descricao ? descricao.trim() : null });
      res.status(201).json({ success: true, data: cat, message: 'Categoria criada com sucesso' });
    } catch (err) {
      console.error('Erro ao criar categoria:', err);
      res.status(500).json({ success: false, error: 'Erro ao criar categoria' });
    }
  },

  update: async (req, res) => {
    const { nome, descricao } = req.body;
    try {
      const cat = await Categoria_vaga.findByPk(req.params.id);
      if (!cat) return res.status(404).json({ success: false, error: 'Categoria não encontrada' });
      if (!nome || nome.trim().length < 2 || nome.trim().length > 100) {
        return res.status(400).json({ success: false, error: 'Nome deve ter entre 2 e 100 caracteres' });
      }
      await cat.update({ nome: nome.trim(), descricao: descricao ? descricao.trim() : null });
      res.json({ success: true, data: cat, message: 'Categoria atualizada com sucesso' });
    } catch (err) {
      console.error('Erro ao atualizar categoria:', err);
      res.status(500).json({ success: false, error: 'Erro ao atualizar categoria' });
    }
  },

  delete: async (req, res) => {
    try {
      const cat = await Categoria_vaga.findByPk(req.params.id);
      if (!cat) return res.status(404).json({ success: false, error: 'Categoria não encontrada' });
      await cat.destroy();
      res.json({ success: true, message: 'Categoria deletada com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar categoria:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar categoria' });
    }
  }
};

// ========== VAGAS ==========
exports.vagas = {
  list: async (req, res) => {
    try {
      const vagas = await Vaga.findAll({
        include: [
          { model: Categoria_vaga, attributes: ['id_categoria', 'nome'] },
          { model: Usuario, attributes: ['id_usuario', 'nome', 'email'] },
          { model: Tags, as: 'tags', through: { attributes: [] }, attributes: ['id_tag', 'nome'] }
        ],
        order: [['data_publicacao', 'DESC']]
      });
      res.json({ success: true, data: vagas });
    } catch (err) {
      console.error('Erro ao listar vagas:', err);
      res.status(500).json({ success: false, error: 'Erro ao listar vagas' });
    }
  },

  show: async (req, res) => {
    try {
      const vaga = await Vaga.findByPk(req.params.id, {
        include: [
          { model: Categoria_vaga, attributes: ['id_categoria', 'nome'] },
          { model: Usuario, attributes: ['id_usuario', 'nome', 'email'] },
          { model: Tags, as: 'tags', through: { attributes: [] }, attributes: ['id_tag', 'nome'] }
        ]
      });
      if (!vaga) return res.status(404).json({ success: false, error: 'Vaga não encontrada' });
      res.json({ success: true, data: vaga });
    } catch (err) {
      console.error('Erro ao buscar vaga:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar vaga' });
    }
  },

  create: async (req, res) => {
    const { titulo, descricao, requisitos, salario, data_expiracao, id_categoria, empresa, localizacao, url_externa, tags } = req.body;
    try {
      console.log('[API VAGAS] POST /vagas body=', req.body);
      // Validações
      if (!titulo || titulo.trim().length < 5 || titulo.trim().length > 200) {
        return res.status(400).json({ success: false, error: 'Título deve ter entre 5 e 200 caracteres' });
      }
      if (!descricao || descricao.trim().length < 10 || descricao.trim().length > 2000) {
        return res.status(400).json({ success: false, error: 'Descrição deve ter entre 10 e 2000 caracteres' });
      }
      if (!requisitos || requisitos.trim().length < 10 || requisitos.trim().length > 2000) {
        return res.status(400).json({ success: false, error: 'Requisitos devem ter entre 10 e 2000 caracteres' });
      }
      if (!id_categoria) {
        return res.status(400).json({ success: false, error: 'Categoria é obrigatória' });
      }
      if (!data_expiracao || new Date(data_expiracao) < new Date()) {
        return res.status(400).json({ success: false, error: 'Data de expiração deve ser futura' });
      }

      const vaga = await Vaga.create({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        requisitos: requisitos.trim(),
        salario: salario || null,
        data_expiracao,
        id_categoria,
        id_usuario_publicador: req.user.id_usuario,
        empresa: empresa || null,
        localizacao: localizacao || null,
        url_externa: url_externa || null
      });

      // Adicionar tags
      if (Array.isArray(tags) && tags.length > 0) {
        await vaga.addTags(tags);
      }

      const vagaFull = await Vaga.findByPk(vaga.id_vaga, {
        include: [
          { model: Categoria_vaga, attributes: ['id_categoria', 'nome'] },
          { model: Usuario, as: 'publicador', attributes: ['id_usuario', 'nome', 'email'] },
          { model: Tags, as: 'tags', through: { attributes: [] }, attributes: ['id_tag', 'nome'] }
        ]
      });

      res.status(201).json({ success: true, data: vagaFull, message: 'Vaga criada com sucesso' });
    } catch (err) {
      console.error('Erro ao criar vaga:', err);
      res.status(500).json({ success: false, error: 'Erro ao criar vaga' });
    }
  },

  update: async (req, res) => {
    const { titulo, descricao, requisitos, salario, data_expiracao, id_categoria, empresa, localizacao, url_externa, tags } = req.body;
    try {
      const vaga = await Vaga.findByPk(req.params.id);
      if (!vaga) return res.status(404).json({ success: false, error: 'Vaga não encontrada' });

      if (titulo && (titulo.trim().length < 5 || titulo.trim().length > 200)) {
        return res.status(400).json({ success: false, error: 'Título deve ter entre 5 e 200 caracteres' });
      }
      if (descricao && (descricao.trim().length < 10 || descricao.trim().length > 2000)) {
        return res.status(400).json({ success: false, error: 'Descrição deve ter entre 10 e 2000 caracteres' });
      }

      await vaga.update({
        titulo: titulo ? titulo.trim() : vaga.titulo,
        descricao: descricao ? descricao.trim() : vaga.descricao,
        requisitos: requisitos ? requisitos.trim() : vaga.requisitos,
        salario: salario !== undefined ? salario : vaga.salario,
        data_expiracao: data_expiracao || vaga.data_expiracao,
        id_categoria: id_categoria || vaga.id_categoria,
        empresa: empresa !== undefined ? empresa : vaga.empresa,
        localizacao: localizacao !== undefined ? localizacao : vaga.localizacao,
        url_externa: url_externa !== undefined ? url_externa : vaga.url_externa
      });

      // Atualizar tags
      if (Array.isArray(tags)) {
        await vaga.setTags([]);
        if (tags.length > 0) await vaga.addTags(tags);
      }

      const vagaFull = await Vaga.findByPk(vaga.id_vaga, {
        include: [
          { model: Categoria_vaga, attributes: ['id_categoria', 'nome'] },
          { model: Usuario, as: 'publicador', attributes: ['id_usuario', 'nome', 'email'] },
          { model: Tags, as: 'tags', through: { attributes: [] }, attributes: ['id_tag', 'nome'] }
        ]
      });

      res.json({ success: true, data: vagaFull, message: 'Vaga atualizada com sucesso' });
    } catch (err) {
      console.error('Erro ao atualizar vaga:', err);
      res.status(500).json({ success: false, error: 'Erro ao atualizar vaga' });
    }
  },

  delete: async (req, res) => {
    try {
      const vaga = await Vaga.findByPk(req.params.id);
      if (!vaga) return res.status(404).json({ success: false, error: 'Vaga não encontrada' });
      await vaga.destroy();
      res.json({ success: true, message: 'Vaga deletada com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar vaga:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar vaga' });
    }
  }
};

// ========== EVENTOS ==========
exports.eventos = {
  list: async (req, res) => {
    try {
      const eventos = await Evento.findAll({
        include: [
          { model: Usuario, attributes: ['id_usuario', 'nome', 'email'] },
          { model: Curso, attributes: ['id_curso', 'nome'] }
        ],
        order: [['data_inicio', 'DESC']]
      });
      res.json({ success: true, data: eventos });
    } catch (err) {
      console.error('Erro ao listar eventos:', err);
      res.status(500).json({ success: false, error: 'Erro ao listar eventos' });
    }
  },

  show: async (req, res) => {
    try {
      const evento = await Evento.findByPk(req.params.id, {
        include: [
          { model: Usuario, attributes: ['id_usuario', 'nome', 'email'] },
          { model: Curso, attributes: ['id_curso', 'nome'] }
        ]
      });
      if (!evento) return res.status(404).json({ success: false, error: 'Evento não encontrado' });
      res.json({ success: true, data: evento });
    } catch (err) {
      console.error('Erro ao buscar evento:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar evento' });
    }
  },

  create: async (req, res) => {
    const { titulo, descricao, data_inicio, data_fim, localizacao, link_inscricao, id_curso } = req.body;
    try {
      console.log('[API EVENTOS] POST /eventos body=', req.body);
      if (!titulo || titulo.trim().length < 3) {
        return res.status(400).json({ success: false, error: 'Título inválido' });
      }
      if (!data_inicio || new Date(data_inicio) < new Date()) {
        return res.status(400).json({ success: false, error: 'Data de início deve ser futura' });
      }
      if (data_fim && new Date(data_fim) <= new Date(data_inicio)) {
        return res.status(400).json({ success: false, error: 'Data de fim deve ser após data de início' });
      }

      const evento = await Evento.create({
        titulo: titulo.trim(),
        descricao: descricao ? descricao.trim() : null,
        data_inicio,
        data_fim: data_fim || null,
        localizacao: localizacao || null,
        link_inscricao: link_inscricao || null,
        id_usuario: req.user.id_usuario,
        id_curso: id_curso || null
      });

      const eventoFull = await Evento.findByPk(evento.id_evento, {
        include: [
          { model: Usuario, attributes: ['id_usuario', 'nome', 'email'] },
          { model: Curso, attributes: ['id_curso', 'nome'] }
        ]
      });

      res.status(201).json({ success: true, data: eventoFull, message: 'Evento criado com sucesso' });
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      res.status(500).json({ success: false, error: 'Erro ao criar evento' });
    }
  },

  update: async (req, res) => {
    const { titulo, descricao, data_inicio, data_fim, localizacao, link_inscricao, id_curso } = req.body;
    try {
      const evento = await Evento.findByPk(req.params.id);
      if (!evento) return res.status(404).json({ success: false, error: 'Evento não encontrado' });

      await evento.update({
        titulo: titulo ? titulo.trim() : evento.titulo,
        descricao: descricao !== undefined ? (descricao ? descricao.trim() : null) : evento.descricao,
        data_inicio: data_inicio || evento.data_inicio,
        data_fim: data_fim !== undefined ? data_fim : evento.data_fim,
        localizacao: localizacao !== undefined ? localizacao : evento.localizacao,
        link_inscricao: link_inscricao !== undefined ? link_inscricao : evento.link_inscricao,
        id_curso: id_curso !== undefined ? id_curso : evento.id_curso
      });

      const eventoFull = await Evento.findByPk(evento.id_evento, {
        include: [
          { model: Usuario, attributes: ['id_usuario', 'nome', 'email'] },
          { model: Curso, attributes: ['id_curso', 'nome'] }
        ]
      });

      res.json({ success: true, data: eventoFull, message: 'Evento atualizado com sucesso' });
    } catch (err) {
      console.error('Erro ao atualizar evento:', err);
      res.status(500).json({ success: false, error: 'Erro ao atualizar evento' });
    }
  },

  delete: async (req, res) => {
    try {
      const evento = await Evento.findByPk(req.params.id);
      if (!evento) return res.status(404).json({ success: false, error: 'Evento não encontrado' });
      await evento.destroy();
      res.json({ success: true, message: 'Evento deletado com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar evento:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar evento' });
    }
  }
};

// ========== NOTICIAS ==========
exports.noticias = {
  list: async (req, res) => {
    try {
      const noticias = await Noticia.findAll({
        include: [{ model: Usuario, attributes: ['id_usuario', 'nome', 'email'] }],
        order: [['data_publicacao', 'DESC']]
      });
      res.json({ success: true, data: noticias });
    } catch (err) {
      console.error('Erro ao listar notícias:', err);
      res.status(500).json({ success: false, error: 'Erro ao listar notícias' });
    }
  },

  show: async (req, res) => {
    try {
      const noticia = await Noticia.findByPk(req.params.id, {
        include: [{ model: Usuario, attributes: ['id_usuario', 'nome', 'email'] }]
      });
      if (!noticia) return res.status(404).json({ success: false, error: 'Notícia não encontrada' });
      res.json({ success: true, data: noticia });
    } catch (err) {
      console.error('Erro ao buscar notícia:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar notícia' });
    }
  },

  create: async (req, res) => {
    const { titulo, subtitulo, conteudo, imagem_url, data_expiracao } = req.body;
    try {
      console.log('[API NOTICIAS] POST /noticias body=', req.body);
      if (!titulo || titulo.trim().length < 5 || titulo.trim().length > 200) {
        return res.status(400).json({ success: false, error: 'Título deve ter entre 5 e 200 caracteres' });
      }
      if (!conteudo || conteudo.trim().length < 10 || conteudo.trim().length > 5000) {
        return res.status(400).json({ success: false, error: 'Conteúdo deve ter entre 10 e 5000 caracteres' });
      }

      const noticia = await Noticia.create({
        titulo: titulo.trim(),
        subtitulo: subtitulo ? subtitulo.trim() : null,
        conteudo: conteudo.trim(),
        imagem_url: imagem_url || null,
        data_publicacao: new Date(),
        data_expiracao: data_expiracao || null,
        id_autor: req.user.id_usuario
      });

      const noticiaFull = await Noticia.findByPk(noticia.id_noticia, {
        include: [{ model: Usuario, attributes: ['id_usuario', 'nome', 'email'] }]
      });

      res.status(201).json({ success: true, data: noticiaFull, message: 'Notícia criada com sucesso' });
    } catch (err) {
      console.error('Erro ao criar notícia:', err);
      res.status(500).json({ success: false, error: 'Erro ao criar notícia' });
    }
  },

  update: async (req, res) => {
    const { titulo, subtitulo, conteudo, imagem_url, data_expiracao } = req.body;
    try {
      const noticia = await Noticia.findByPk(req.params.id);
      if (!noticia) return res.status(404).json({ success: false, error: 'Notícia não encontrada' });

      if (titulo && (titulo.trim().length < 5 || titulo.trim().length > 200)) {
        return res.status(400).json({ success: false, error: 'Título deve ter entre 5 e 200 caracteres' });
      }
      if (conteudo && (conteudo.trim().length < 10 || conteudo.trim().length > 5000)) {
        return res.status(400).json({ success: false, error: 'Conteúdo deve ter entre 10 e 5000 caracteres' });
      }

      await noticia.update({
        titulo: titulo ? titulo.trim() : noticia.titulo,
        subtitulo: subtitulo !== undefined ? (subtitulo ? subtitulo.trim() : null) : noticia.subtitulo,
        conteudo: conteudo ? conteudo.trim() : noticia.conteudo,
        imagem_url: imagem_url !== undefined ? imagem_url : noticia.imagem_url,
        data_expiracao: data_expiracao !== undefined ? data_expiracao : noticia.data_expiracao
      });

      const noticiaFull = await Noticia.findByPk(noticia.id_noticia, {
        include: [{ model: Usuario, attributes: ['id_usuario', 'nome', 'email'] }]
      });

      res.json({ success: true, data: noticiaFull, message: 'Notícia atualizada com sucesso' });
    } catch (err) {
      console.error('Erro ao atualizar notícia:', err);
      res.status(500).json({ success: false, error: 'Erro ao atualizar notícia' });
    }
  },

  delete: async (req, res) => {
    try {
      const noticia = await Noticia.findByPk(req.params.id);
      if (!noticia) return res.status(404).json({ success: false, error: 'Notícia não encontrada' });
      await noticia.destroy();
      res.json({ success: true, message: 'Notícia deletada com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar notícia:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar notícia' });
    }
  }
};

// ========== OPORTUNIDADES ==========
exports.oportunidades = {
  list: async (req, res) => {
    try {
      const oprs = await Oportunidade.findAll({
        include: [{ model: TipoOportunidade, attributes: ['id_tipo_oportunidade', 'nome'] }],
        order: [['data_publicacao', 'DESC']]
      });
      res.json({ success: true, data: oprs });
    } catch (err) {
      console.error('Erro ao listar oportunidades:', err);
      res.status(500).json({ success: false, error: 'Erro ao listar oportunidades' });
    }
  },

  show: async (req, res) => {
    try {
      const opr = await Oportunidade.findByPk(req.params.id, {
        include: [{ model: TipoOportunidade, attributes: ['id_tipo_oportunidade', 'nome'] }]
      });
      if (!opr) return res.status(404).json({ success: false, error: 'Oportunidade não encontrada' });
      res.json({ success: true, data: opr });
    } catch (err) {
      console.error('Erro ao buscar oportunidade:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar oportunidade' });
    }
  },

  create: async (req, res) => {
    const { titulo, descricao, data_prazo, id_tipo_oportunidade, link } = req.body;
    try {
      console.log('[API OPORTUNIDADES] POST /oportunidades body=', req.body);
      if (!titulo || titulo.trim().length < 5 || titulo.trim().length > 200) {
        return res.status(400).json({ success: false, error: 'Título deve ter entre 5 e 200 caracteres' });
      }
      if (!descricao || descricao.trim().length < 10 || descricao.trim().length > 3000) {
        return res.status(400).json({ success: false, error: 'Descrição deve ter entre 10 e 3000 caracteres' });
      }
      if (!id_tipo_oportunidade) {
        return res.status(400).json({ success: false, error: 'Tipo é obrigatório' });
      }

      const opr = await Oportunidade.create({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        data_publicacao: new Date(),
        data_prazo: data_prazo || null,
        id_tipo_oportunidade,
        link: link || null
      });

      const oprFull = await Oportunidade.findByPk(opr.id_oportunidade, {
        include: [{ model: TipoOportunidade, as: 'tipoOportunidade', attributes: ['id_tipo_oportunidade', 'nome'] }]
      });

      res.status(201).json({ success: true, data: oprFull, message: 'Oportunidade criada com sucesso' });
    } catch (err) {
      console.error('Erro ao criar oportunidade:', err);
      res.status(500).json({ success: false, error: 'Erro ao criar oportunidade' });
    }
  },

  update: async (req, res) => {
    const { titulo, descricao, data_prazo, id_tipo_oportunidade, link } = req.body;
    try {
      const opr = await Oportunidade.findByPk(req.params.id);
      if (!opr) return res.status(404).json({ success: false, error: 'Oportunidade não encontrada' });

      if (titulo && (titulo.trim().length < 5 || titulo.trim().length > 200)) {
        return res.status(400).json({ success: false, error: 'Título deve ter entre 5 e 200 caracteres' });
      }
      if (descricao && (descricao.trim().length < 10 || descricao.trim().length > 3000)) {
        return res.status(400).json({ success: false, error: 'Descrição deve ter entre 10 e 3000 caracteres' });
      }

      await opr.update({
        titulo: titulo ? titulo.trim() : opr.titulo,
        descricao: descricao ? descricao.trim() : opr.descricao,
        data_prazo: data_prazo !== undefined ? data_prazo : opr.data_prazo,
        id_tipo_oportunidade: id_tipo_oportunidade || opr.id_tipo_oportunidade,
        link: link !== undefined ? link : opr.link
      });

      const oprFull = await Oportunidade.findByPk(opr.id_oportunidade, {
        include: [{ model: TipoOportunidade, as: 'tipoOportunidade', attributes: ['id_tipo_oportunidade', 'nome'] }]
      });

      res.json({ success: true, data: oprFull, message: 'Oportunidade atualizada com sucesso' });
    } catch (err) {
      console.error('Erro ao atualizar oportunidade:', err);
      res.status(500).json({ success: false, error: 'Erro ao atualizar oportunidade' });
    }
  },

  delete: async (req, res) => {
    try {
      const opr = await Oportunidade.findByPk(req.params.id);
      if (!opr) return res.status(404).json({ success: false, error: 'Oportunidade não encontrada' });
      await opr.destroy();
      res.json({ success: true, message: 'Oportunidade deletada com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar oportunidade:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar oportunidade' });
    }
  }
};

// ========== INFORMACOES ==========
exports.informacoes = {
  list: async (req, res) => {
    try {
      const infos = await Informacoes.findAll({ order: [['ultima_att', 'DESC']] });
      res.json({ success: true, data: infos });
    } catch (err) {
      console.error('Erro ao listar informações:', err);
      res.status(500).json({ success: false, error: 'Erro ao listar informações' });
    }
  },

  show: async (req, res) => {
    try {
      const info = await Informacoes.findByPk(req.params.id);
      if (!info) return res.status(404).json({ success: false, error: 'Informação não encontrada' });
      res.json({ success: true, data: info });
    } catch (err) {
      console.error('Erro ao buscar informação:', err);
      res.status(500).json({ success: false, error: 'Erro ao buscar informação' });
    }
  },

  create: async (req, res) => {
    const { chave, titulo, conteudo, endereco, telefone, email } = req.body;
    try {
      console.log('[API INFORMACOES] POST /informacoes body=', req.body);
      if (!chave || chave.trim().length < 2) {
        return res.status(400).json({ success: false, error: 'Chave deve ter pelo menos 2 caracteres' });
      }
      if (!titulo || titulo.trim().length < 3) {
        return res.status(400).json({ success: false, error: 'Título deve ter pelo menos 3 caracteres' });
      }
      if (!conteudo || conteudo.trim().length < 3) {
        return res.status(400).json({ success: false, error: 'Conteúdo muito curto' });
      }

      const info = await Informacoes.create({
        chave: chave.trim(),
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        endereco: endereco ? endereco.trim() : null,
        telefone: telefone ? telefone.trim() : null,
        email: email ? email.trim() : null,
        ultima_att: new Date()
      });

      res.status(201).json({ success: true, data: info, message: 'Informação criada com sucesso' });
    } catch (err) {
      console.error('Erro ao criar informação:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      if (err.parent) console.error('Parent error:', err.parent);
      if (err.sql) console.error('SQL:', err.sql);
      res.status(500).json({ success: false, error: 'Erro ao criar informação', details: err.message });
    }
  },

  update: async (req, res) => {
    const { chave, titulo, conteudo, endereco, telefone, email } = req.body;
    try {
      const info = await Informacoes.findByPk(req.params.id);
      if (!info) return res.status(404).json({ success: false, error: 'Informação não encontrada' });

      if (chave && chave.trim().length < 2) {
        return res.status(400).json({ success: false, error: 'Chave deve ter pelo menos 2 caracteres' });
      }
      if (titulo && titulo.trim().length < 3) {
        return res.status(400).json({ success: false, error: 'Título deve ter pelo menos 3 caracteres' });
      }

      await info.update({
        chave: chave ? chave.trim() : info.chave,
        titulo: titulo ? titulo.trim() : info.titulo,
        conteudo: conteudo ? conteudo.trim() : info.conteudo,
        endereco: endereco !== undefined ? (endereco ? endereco.trim() : null) : info.endereco,
        telefone: telefone !== undefined ? (telefone ? telefone.trim() : null) : info.telefone,
        email: email !== undefined ? (email ? email.trim() : null) : info.email,
        ultima_att: new Date()
      });

      res.json({ success: true, data: info, message: 'Informação atualizada com sucesso' });
    } catch (err) {
      console.error('Erro ao atualizar informação:', err);
      res.status(500).json({ success: false, error: 'Erro ao atualizar informação' });
    }
  },

  delete: async (req, res) => {
    try {
      const info = await Informacoes.findByPk(req.params.id);
      if (!info) return res.status(404).json({ success: false, error: 'Informação não encontrada' });
      await info.destroy();
      res.json({ success: true, message: 'Informação deletada com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar informação:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar informação' });
    }
  }
};
