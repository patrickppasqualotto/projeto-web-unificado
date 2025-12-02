/**
 * TAGS SERVICE - Lógica de Negócio de Tags
 */

const BaseService = require('./BaseService');
const TagsRepository = require('../repositories/TagsRepository');

class TagsService extends BaseService {
  constructor() {
    const repository = new TagsRepository();
    super(repository, 'Tag');
  }

  /**
   * Listar tags ordenadas
   * @returns {array} Tags ordenadas
   */
  async listarOrdenadas() {
    return await this.repository.listarOrdenadas();
  }

  /**
   * Criar tag validando nome único
   * @param {object} data - { nome }
   * @returns {object} Tag criada
   */
  async criarUnica(data) {
    if (!data || !data.nome) {
      throw {
        status: 400,
        message: 'Nome é obrigatório',
        field: 'nome'
      };
    }

    try {
      return await this.repository.criarUnica(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obter tags por IDs
   * @param {array} ids - Array de IDs
   * @returns {array} Tags
   */
  async obterPorIds(ids = []) {
    return await this.repository.findByIds(ids);
  }
}

module.exports = TagsService;
