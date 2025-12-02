/**
 * OPORTUNIDADES SERVICE - Lógica de Negócio de Oportunidades
 */

const BaseService = require('./BaseService');
const OportunidadesRepository = require('../repositories/OportunidadesRepository');

class OportunidadesService extends BaseService {
  constructor() {
    const repository = new OportunidadesRepository();
    super(repository, 'Oportunidade');
  }

  /**
   * Listar oportunidades com relacionamentos
   * @returns {array} Oportunidades
   */
  async listarComRelacionamentos() {
    return await this.repository.listarComRelacionamentos();
  }

  /**
   * Listar oportunidades ativas
   * @returns {array} Oportunidades ativas
   */
  async listarAtivas() {
    return await this.repository.listarAtivas();
  }

  /**
   * Obter oportunidade com relacionamentos
   * @param {number} id - ID da oportunidade
   * @returns {object} Oportunidade
   */
  async obterComRelacionamentos(id) {
    return await this.repository.findByIdComRelacionamentos(id);
  }

  /**
   * Filtrar oportunidades por tipo
   * @param {number} tipoId - ID do tipo
   * @returns {array} Oportunidades
   */
  async filtrarPorTipo(tipoId) {
    if (!tipoId) {
      throw {
        status: 400,
        message: 'ID do tipo é obrigatório'
      };
    }

    return await this.repository.filtrarPorTipo(tipoId);
  }
}

module.exports = OportunidadesService;
