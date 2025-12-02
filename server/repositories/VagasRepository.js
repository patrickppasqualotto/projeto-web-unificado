/**
 * VAGAS REPOSITORY - Acesso a dados de Vagas
 */

const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const BaseRepository = require('./BaseRepository');

const VagaModel = require(path.resolve(__dirname, '../../models/Vaga'))(sequelize, DataTypes);
const Vaga_TagsModel = require(path.resolve(__dirname, '../../models/Vaga_Tags'))(sequelize, DataTypes);
const TagsModel = require(path.resolve(__dirname, '../../models/Tags'))(sequelize, DataTypes);
const CategoriavagaModel = require(path.resolve(__dirname, '../../models/Categoria_vaga'))(sequelize, DataTypes);
const UsuarioModel = require(path.resolve(__dirname, '../../models/Usuario'))(sequelize, DataTypes);

// Configurar relacionamentos
VagaModel.belongsToMany(TagsModel, { through: Vaga_TagsModel, foreignKey: 'id_vaga', otherKey: 'id_tag' });
TagsModel.belongsToMany(VagaModel, { through: Vaga_TagsModel, foreignKey: 'id_tag', otherKey: 'id_vaga' });
VagaModel.belongsTo(CategoriavagaModel, { foreignKey: 'id_categoria' });
VagaModel.belongsTo(UsuarioModel, { foreignKey: 'id_usuario_publicador', as: 'publicador' });

class VagasRepository extends BaseRepository {
  constructor() {
    super(VagaModel);
  }

  /**
   * Listar vagas com relacionamentos
   * @returns {array} Vagas
   */
  async listarComRelacionamentos() {
    return this.findAll({
      include: [
        { model: CategoriavagaModel, attributes: ['id_categoria', 'nome'] },
        { model: UsuarioModel, as: 'publicador', attributes: ['id_usuario', 'nome', 'email'] },
        { model: TagsModel, attributes: ['id_tag', 'nome'], through: { attributes: [] } }
      ],
      order: [['data_publicacao', 'DESC']]
    });
  }

  /**
   * Listar vagas ativas (não expiradas)
   * @returns {array} Vagas ativas
   */
  async listarAtivas() {
    return this.findAll({
      where: sequelize.where(
        sequelize.col('data_expiracao'),
        sequelize.Op.gt,
        new Date()
      ),
      include: [
        { model: CategoriavagaModel, attributes: ['nome'] },
        { model: UsuarioModel, as: 'publicador', attributes: ['nome'] },
        { model: TagsModel, attributes: ['id_tag', 'nome'], through: { attributes: [] } }
      ],
      order: [['data_publicacao', 'DESC']]
    });
  }

  /**
   * Encontrar vaga com relacionamentos
   * @param {number} id - ID da vaga
   * @returns {object} Vaga
   */
  async findByIdComRelacionamentos(id) {
    return this.findById(id, {
      include: [
        { model: CategoriavagaModel, attributes: ['id_categoria', 'nome'] },
        { model: UsuarioModel, as: 'publicador', attributes: ['id_usuario', 'nome', 'email'] },
        { model: TagsModel, attributes: ['id_tag', 'nome'], through: { attributes: [] } }
      ]
    });
  }

  /**
   * Criar vaga com tags
   * @param {object} data - Dados da vaga
   * @param {array} tagIds - IDs das tags
   * @returns {object} Vaga criada
   */
  async criarComTags(data, tagIds = []) {
    return this.transaction(async (t) => {
      const vaga = await this.model.create(data, { transaction: t });

      if (Array.isArray(tagIds) && tagIds.length > 0) {
        await vaga.addTags(tagIds, { transaction: t });
      }

      return vaga;
    });
  }

  /**
   * Atualizar vaga com tags
   * @param {number} id - ID da vaga
   * @param {object} data - Dados a atualizar
   * @param {array} tagIds - IDs das tags (opcional)
   * @returns {object} Vaga atualizada
   */
  async atualizarComTags(id, data, tagIds = null) {
    return this.transaction(async (t) => {
      const vaga = await this.model.findByPk(id, { transaction: t });
      if (!vaga) {
        throw { status: 404, message: 'Vaga não encontrada' };
      }

      await vaga.update(data, { transaction: t });

      if (Array.isArray(tagIds)) {
        await vaga.setTags(tagIds, { transaction: t });
      }

      return vaga;
    });
  }

  /**
   * Filtrar vagas por critérios
   * @param {object} filtros - { categoria, tags, texto }
   * @returns {array} Vagas filtradas
   */
  async filtrar(filtros = {}) {
    const where = {};
    const include = [
      { model: CategoriavagaModel, attributes: ['nome'] },
      { model: UsuarioModel, as: 'publicador', attributes: ['nome'] },
      { model: TagsModel, attributes: ['id_tag', 'nome'], through: { attributes: [] } }
    ];

    if (filtros.categoria) {
      where.id_categoria = filtros.categoria;
    }

    if (filtros.texto) {
      where[sequelize.Op.or] = [
        { titulo: { [sequelize.Op.iLike]: `%${filtros.texto}%` } },
        { descricao: { [sequelize.Op.iLike]: `%${filtros.texto}%` } }
      ];
    }

    if (filtros.ativas !== false) {
      where.data_expiracao = { [sequelize.Op.gt]: new Date() };
    }

    return this.findAll({
      where,
      include: filtros.tags ? include : [include[0], include[1]],
      order: [['data_publicacao', 'DESC']]
    });
  }
}

module.exports = VagasRepository;
