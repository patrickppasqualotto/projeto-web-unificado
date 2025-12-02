/**
 * EVENTOS SERVICE - Lógica de Negócio de Eventos
 */

const BaseService = require('./BaseService');
const EventosRepository = require('../repositories/EventosRepository');

class EventosService extends BaseService {
  constructor() {
    const repository = new EventosRepository();
    super(repository, 'Evento');
  }

  /**
   * Listar eventos com relacionamentos
   * @returns {array} Eventos
   */
  async listarComRelacionamentos() {
    return await this.repository.listarComRelacionamentos();
  }

  /**
   * Listar eventos futuros
   * @returns {array} Eventos futuros
   */
  async listarFuturos() {
    return await this.repository.listarFuturos();
  }

  /**
   * Obter evento com relacionamentos
   * @param {number} id - ID do evento
   * @returns {object} Evento
   */
  async obterComRelacionamentos(id) {
    return await this.repository.findByIdComRelacionamentos(id);
  }

  /**
   * Filtrar eventos
   * @param {object} filtros - { dataInicio, dataFim, idCurso }
   * @returns {array} Eventos
   */
  async filtrar(filtros = {}) {
    return await this.repository.filtrar(filtros);
  }
}

module.exports = EventosService;
