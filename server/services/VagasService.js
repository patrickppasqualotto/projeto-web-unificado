/**
 * VAGAS SERVICE - Lógica de Negócio de Vagas
 */

const BaseService = require('./BaseService');
const VagasRepository = require('../repositories/VagasRepository');

class VagasService extends BaseService {
  constructor() {
    const repository = new VagasRepository();
    super(repository, 'Vaga');
  }

  /**
   * Listar vagas com relacionamentos
   * @returns {array} Vagas
   */
  async listarComRelacionamentos() {
    return await this.repository.listarComRelacionamentos();
  }

  /**
   * Listar vagas ativas
   * @returns {array} Vagas ativas
   */
  async listarAtivas() {
    return await this.repository.listarAtivas();
  }

  /**
   * Obter vaga com relacionamentos
   * @param {number} id - ID da vaga
   * @returns {object} Vaga
   */
  async obterComRelacionamentos(id) {
    return await this.repository.findByIdComRelacionamentos(id);
  }

  /**
   * Criar vaga com tags
   * @param {object} data - Dados da vaga
   * @param {array} tagIds - IDs das tags
   * @param {function} validationFn - Validação
   * @returns {object} Vaga criada
   */
  async criarComTags(data, tagIds = [], validationFn = null) {
    if (validationFn && typeof validationFn === 'function') {
      await validationFn(data);
    }

    return await this.repository.criarComTags(data, tagIds);
  }

  /**
   * Atualizar vaga com tags
   * @param {number} id - ID da vaga
   * @param {object} data - Dados a atualizar
   * @param {array} tagIds - IDs das tags (opcional)
   * @param {function} validationFn - Validação
   * @returns {object} Vaga atualizada
   */
  async atualizarComTags(id, data, tagIds = null, validationFn = null) {
    if (validationFn && typeof validationFn === 'function') {
      await validationFn(data);
    }

    return await this.repository.atualizarComTags(id, data, tagIds);
  }

  /**
   * Filtrar vagas
   * @param {object} filtros - { categoria, tags, texto, ativas }
   * @returns {array} Vagas filtradas
   */
  async filtrar(filtros = {}) {
    return await this.repository.filtrar(filtros);
  }
}

module.exports = VagasService;
