/**
 * INFORMACOES REPOSITORY - Acesso a dados de Informações
 */

const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const BaseRepository = require('./BaseRepository');

const InformacoesModel = require(path.resolve(__dirname, '../../models/Informacoes'))(sequelize, DataTypes);

class InformacoesRepository extends BaseRepository {
  constructor() {
    super(InformacoesModel);
  }

  /**
   * Encontrar informação por chave
   * @param {string} chave - Chave da informação
   * @returns {object} Informação
   */
  async findByChave(chave) {
    const info = await this.model.findOne({
      where: { chave: chave.trim() }
    });

    if (!info) {
      throw {
        status: 404,
        message: `Informação com chave "${chave}" não encontrada`
      };
    }

    return info;
  }

  /**
   * Verificar se chave existe
   * @param {string} chave - Chave
   * @returns {boolean} True se existe
   */
  async chaveExiste(chave) {
    return this.exists({
      chave: chave.trim()
    });
  }

  /**
   * Atualizar ou criar informação
   * @param {string} chave - Chave
   * @param {object} data - { titulo, descricao }
   * @returns {object} Informação
   */
  async upsert(chave, data) {
    const existe = await this.chaveExiste(chave);

    if (existe) {
      const info = await this.findByChave(chave);
      return await this.update(info.id_informacoes, {
        ...data,
        ultima_att: new Date()
      });
    }

    return await this.create({
      chave: chave.trim(),
      ...data,
      ultima_att: new Date()
    });
  }

  /**
   * Listar ordenado por chave
   * @returns {array} Informações
   */
  async listarOrdenado() {
    return this.findAll({
      order: [['chave', 'ASC']]
    });
  }
}

module.exports = InformacoesRepository;
