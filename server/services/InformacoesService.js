/**
 * INFORMACOES SERVICE - Lógica de Negócio de Informações
 */

const BaseService = require('./BaseService');
const InformacoesRepository = require('../repositories/InformacoesRepository');

class InformacoesService extends BaseService {
  constructor() {
    const repository = new InformacoesRepository();
    super(repository, 'Informação');
  }

  /**
   * Obter por chave
   * @param {string} chave - Chave da informação
   * @returns {object} Informação
   */
  async obterPorChave(chave) {
    return await this.repository.findByChave(chave);
  }

  /**
   * Listar ordenado por chave
   * @returns {array} Informações
   */
  async listarOrdenado() {
    return await this.repository.listarOrdenado();
  }

  /**
   * Atualizar ou criar
   * @param {string} chave - Chave
   * @param {object} data - { titulo, descricao }
   * @returns {object} Informação
   */
  async upsert(chave, data) {
    if (!chave || chave.trim().length === 0) {
      throw {
        status: 400,
        message: 'Chave é obrigatória',
        field: 'chave'
      };
    }

    return await this.repository.upsert(chave, data);
  }
}

module.exports = InformacoesService;
