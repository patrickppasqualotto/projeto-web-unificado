/**
 * CATEGORIA VAGA SERVICE - Lógica de Negócio de Categorias
 */

const BaseService = require('./BaseService');
const CategoriavagaRepository = require('../repositories/CategoriavagaRepository');

class CategoriavagaService extends BaseService {
  constructor() {
    const repository = new CategoriavagaRepository();
    super(repository, 'Categoria de Vaga');
  }

  /**
   * Listar categorias ordenadas
   * @returns {array} Categorias ordenadas
   */
  async listarOrdenadas() {
    return await this.repository.listarOrdenadas();
  }

  /**
   * Deletar categoria validando se tem vagas
   * @param {number} id - ID da categoria
   * @returns {number} Quantidade deletada
   */
  async deletarComValidacao(id) {
    const temVagas = await this.repository.temVagas(id);

    if (temVagas) {
      throw {
        status: 400,
        message: 'Não é possível deletar categoria com vagas associadas'
      };
    }

    return await this.deletar(id);
  }
}

module.exports = CategoriavagaService;
