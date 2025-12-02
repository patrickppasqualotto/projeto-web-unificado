/**
 * BASE REPOSITORY - Classe Base para Repositories
 * 
 * Fornece operações CRUD padrão e pode ser estendida
 * Centraliza acesso aos modelos Sequelize
 */

const { AppError } = require('../utils/errorHandler');

class BaseRepository {
  /**
   * Construtor
   * @param {Model} model - Modelo Sequelize
   */
  constructor(model) {
    if (!model) {
      throw new AppError('Modelo é obrigatório para BaseRepository', 500);
    }
    this.model = model;
  }

  /**
   * Encontrar todos os registros
   * @param {object} options - Opções (where, include, order, limit, offset)
   * @returns {array} Registros encontrados
   */
  async findAll(options = {}) {
    try {
      return await this.model.findAll(options);
    } catch (error) {
      throw new AppError(
        `Erro ao listar ${this.model.tableName}`,
        500,
        null,
        error
      );
    }
  }

  /**
   * Encontrar um registro por ID
   * @param {number} id - ID do registro
   * @param {object} options - Opções adicionais (include, etc)
   * @returns {object} Registro encontrado
   */
  async findById(id, options = {}) {
    try {
      const record = await this.model.findByPk(id, options);
      if (!record) {
        throw new AppError(
          `${this.model.tableName} com ID ${id} não encontrado`,
          404
        );
      }
      return record;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Erro ao buscar ${this.model.tableName}`,
        500,
        null,
        error
      );
    }
  }

  /**
   * Encontrar registros com filtros
   * @param {object} where - Filtros (ex: { status: 'ativo' })
   * @param {object} options - Opções adicionais
   * @returns {array} Registros encontrados
   */
  async findWith(where = {}, options = {}) {
    try {
      return await this.model.findAll({
        where,
        ...options
      });
    } catch (error) {
      throw new AppError(
        `Erro ao buscar ${this.model.tableName} com filtros`,
        500,
        null,
        error
      );
    }
  }

  /**
   * Criar novo registro
   * @param {object} data - Dados do registro
   * @returns {object} Registro criado
   */
  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      // Extrair informação de campo do erro Sequelize
      let field = null;
      let message = `Erro ao criar ${this.model.tableName}`;

      if (error.name === 'SequelizeUniqueConstraintError') {
        const fields = Object.keys(error.fields || {});
        field = fields[0];
        message = `${field} já existe`;
      } else if (error.name === 'SequelizeForeignKeyConstraintError') {
        field = error.fields ? Object.keys(error.fields)[0] : 'relação';
        message = `Referência inválida em ${field}`;
      }

      throw new AppError(message, 400, field, error);
    }
  }

  /**
   * Atualizar registro
   * @param {number} id - ID do registro
   * @param {object} data - Dados a atualizar
   * @returns {object} Registro atualizado
   */
  async update(id, data) {
    try {
      const record = await this.findById(id);
      return await record.update(data);
    } catch (error) {
      if (error instanceof AppError) throw error;

      let field = null;
      let message = `Erro ao atualizar ${this.model.tableName}`;

      if (error.name === 'SequelizeUniqueConstraintError') {
        const fields = Object.keys(error.fields || {});
        field = fields[0];
        message = `${field} já existe`;
      }

      throw new AppError(message, 400, field, error);
    }
  }

  /**
   * Deletar registro
   * @param {number} id - ID do registro
   * @returns {number} Número de registros deletados
   */
  async delete(id) {
    try {
      const record = await this.findById(id);
      await record.destroy();
      return 1;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Erro ao deletar ${this.model.tableName}`,
        500,
        null,
        error
      );
    }
  }

  /**
   * Contar registros
   * @param {object} where - Filtros
   * @returns {number} Quantidade de registros
   */
  async count(where = {}) {
    try {
      return await this.model.count({ where });
    } catch (error) {
      throw new AppError(
        `Erro ao contar ${this.model.tableName}`,
        500,
        null,
        error
      );
    }
  }

  /**
   * Verificar se registro existe
   * @param {object} where - Filtros
   * @returns {boolean} True se existe
   */
  async exists(where = {}) {
    try {
      const count = await this.count(where);
      return count > 0;
    } catch (error) {
      throw new AppError(
        `Erro ao verificar existência em ${this.model.tableName}`,
        500,
        null,
        error
      );
    }
  }

  /**
   * Encontrar com paginação
   * @param {number} page - Número da página (começa em 1)
   * @param {number} pageSize - Tamanho da página
   * @param {object} options - Opções adicionais (where, order, include)
   * @returns {object} { data, total, page, pageSize, pages }
   */
  async paginate(page = 1, pageSize = 10, options = {}) {
    try {
      const offset = (page - 1) * pageSize;
      const { count, rows } = await this.model.findAndCountAll({
        offset,
        limit: pageSize,
        ...options
      });

      return {
        data: rows,
        total: count,
        page,
        pageSize,
        pages: Math.ceil(count / pageSize)
      };
    } catch (error) {
      throw new AppError(
        `Erro ao paginar ${this.model.tableName}`,
        500,
        null,
        error
      );
    }
  }

  /**
   * Transação para múltiplas operações
   * @param {function} callback - Função com operações
   * @returns {any} Resultado da função
   */
  async transaction(callback) {
    const t = await this.model.sequelize.transaction();
    try {
      const result = await callback(t);
      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = BaseRepository;
