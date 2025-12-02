/**
 * BASE SERVICE - Classe Base para Services
 * 
 * Fornece orquestração padrão da lógica de negócio
 * Integra com Repositories e validações
 */

const { AppError } = require('../utils/errorHandler');

class BaseService {
  /**
   * Construtor
   * @param {BaseRepository} repository - Instância do Repository
   * @param {string} entityName - Nome da entidade (para mensagens)
   */
  constructor(repository, entityName) {
    if (!repository) {
      throw new AppError('Repository é obrigatório para BaseService', 500);
    }
    this.repository = repository;
    this.entityName = entityName || 'Entidade';
  }

  /**
   * Listar todos com filtros opcionais
   * @param {object} filters - Filtros
   * @param {object} options - Opções (order, include, etc)
   * @returns {array} Registros
   */
  async listar(filters = {}, options = {}) {
    try {
      if (Object.keys(filters).length > 0) {
        return await this.repository.findWith(filters, options);
      }
      return await this.repository.findAll(options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obter um registro por ID
   * @param {number} id - ID do registro
   * @param {object} options - Opções (include, etc)
   * @returns {object} Registro
   */
  async obter(id, options = {}) {
    try {
      return await this.repository.findById(id, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Criar novo registro com validação
   * @param {object} data - Dados do registro
   * @param {function} validationFn - Função de validação (opcional)
   * @returns {object} Registro criado
   */
  async criar(data, validationFn = null) {
    try {
      // Validar dados de negócio antes de criar
      if (validationFn && typeof validationFn === 'function') {
        await validationFn(data);
      }

      return await this.repository.create(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualizar registro com validação
   * @param {number} id - ID do registro
   * @param {object} data - Dados a atualizar
   * @param {function} validationFn - Função de validação (opcional)
   * @returns {object} Registro atualizado
   */
  async atualizar(id, data, validationFn = null) {
    try {
      // Validar dados de negócio antes de atualizar
      if (validationFn && typeof validationFn === 'function') {
        await validationFn(data);
      }

      return await this.repository.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletar registro
   * @param {number} id - ID do registro
   * @param {function} preDeleteFn - Função antes de deletar (opcional)
   * @returns {number} Quantidade deletada
   */
  async deletar(id, preDeleteFn = null) {
    try {
      if (preDeleteFn && typeof preDeleteFn === 'function') {
        await preDeleteFn(id);
      }

      return await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obter com paginação
   * @param {number} page - Número da página
   * @param {number} pageSize - Tamanho da página
   * @param {object} options - Opções (where, order, include)
   * @returns {object} Resultado paginado
   */
  async listarComPaginacao(page = 1, pageSize = 10, options = {}) {
    try {
      return await this.repository.paginate(page, pageSize, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar se existe
   * @param {object} filters - Filtros
   * @returns {boolean} True se existe
   */
  async existe(filters = {}) {
    try {
      return await this.repository.exists(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Contar registros
   * @param {object} filters - Filtros
   * @returns {number} Quantidade
   */
  async contar(filters = {}) {
    try {
      return await this.repository.count(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Operação em transação
   * @param {function} callback - Função com operações
   * @returns {any} Resultado
   */
  async emTransacao(callback) {
    try {
      return await this.repository.transaction(callback);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Transformar dados para resposta (pode ser sobrescrito)
   * @param {object} data - Dados brutos
   * @returns {object} Dados transformados
   */
  transformarParaResposta(data) {
    // Pode ser sobrescrito em classes filhas para lógica customizada
    if (Array.isArray(data)) {
      return data.map(item => this._transformarItem(item));
    }
    return this._transformarItem(data);
  }

  /**
   * Transformar item individual (pode ser sobrescrito)
   * @param {object} item - Item bruto
   * @returns {object} Item transformado
   */
  _transformarItem(item) {
    if (item.toJSON && typeof item.toJSON === 'function') {
      return item.toJSON();
    }
    return item;
  }
}

module.exports = BaseService;
