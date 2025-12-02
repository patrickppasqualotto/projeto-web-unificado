/**
 * NOTICIAS SERVICE - Lógica de Negócio de Notícias
 */

const BaseService = require('./BaseService');
const NoticiasRepository = require('../repositories/NoticiasRepository');

class NoticiasService extends BaseService {
  constructor() {
    const repository = new NoticiasRepository();
    super(repository, 'Notícia');
  }

  /**
   * Listar notícias com relacionamentos
   * @returns {array} Notícias
   */
  async listarComRelacionamentos() {
    return await this.repository.listarComRelacionamentos();
  }

  /**
   * Listar notícias ativas
   * @returns {array} Notícias ativas
   */
  async listarAtivas() {
    return await this.repository.listarAtivas();
  }

  /**
   * Obter notícia com relacionamentos
   * @param {number} id - ID da notícia
   * @returns {object} Notícia
   */
  async obterComRelacionamentos(id) {
    return await this.repository.findByIdComRelacionamentos(id);
  }

  /**
   * Buscar notícias por texto
   * @param {string} texto - Texto para buscar
   * @returns {array} Notícias
   */
  async buscarPorTexto(texto) {
    if (!texto || texto.trim().length === 0) {
      throw {
        status: 400,
        message: 'Texto de busca é obrigatório'
      };
    }

    return await this.repository.buscarPorTexto(texto.trim());
  }
}

module.exports = NoticiasService;
