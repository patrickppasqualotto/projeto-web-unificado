/**
 * TAGS REPOSITORY - Acesso a dados de Tags
 */

const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const BaseRepository = require('./BaseRepository');

const TagsModel = require(path.resolve(__dirname, '../../models/Tags'))(sequelize, DataTypes);

class TagsRepository extends BaseRepository {
  constructor() {
    super(TagsModel);
  }

  /**
   * Listar tags ordenadas alfabeticamente
   * @returns {array} Tags ordenadas
   */
  async listarOrdenadas() {
    return this.findAll({
      order: [['nome', 'ASC']]
    });
  }

  /**
   * Encontrar tag por nome
   * @param {string} nome - Nome da tag
   * @returns {object} Tag encontrada
   */
  async findByNome(nome) {
    const tag = await this.model.findOne({
      where: { nome: nome.trim() }
    });

    if (!tag) {
      throw {
        status: 404,
        message: `Tag "${nome}" não encontrada`
      };
    }

    return tag;
  }

  /**
   * Criar tag única
   * @param {object} data - { nome }
   * @returns {object} Tag criada
   */
  async criarUnica(data) {
    const { nome } = data;

    // Verificar duplicata
    const existe = await this.model.findOne({
      where: { nome: nome.trim() }
    });

    if (existe) {
      throw {
        status: 400,
        message: `Tag "${nome}" já existe`,
        field: 'nome'
      };
    }

    return this.create({
      nome: nome.trim()
    });
  }

  /**
   * Buscar tags por array de IDs
   * @param {array} ids - Array de IDs
   * @returns {array} Tags encontradas
   */
  async findByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }

    return this.findWith({
      id_tag: ids
    }, {
      order: [['nome', 'ASC']]
    });
  }
}

module.exports = TagsRepository;
