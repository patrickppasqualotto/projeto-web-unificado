/**
 * CATEGORIA VAGA REPOSITORY - Acesso a dados de Categorias de Vaga
 */

const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const BaseRepository = require('./BaseRepository');

const CategoriavagaModel = require(path.resolve(__dirname, '../../models/Categoria_vaga'))(sequelize, DataTypes);

class CategoriavagaRepository extends BaseRepository {
  constructor() {
    super(CategoriavagaModel);
  }

  /**
   * Listar categorias ordenadas alfabeticamente
   * @returns {array} Categorias ordenadas
   */
  async listarOrdenadas() {
    return this.findAll({
      order: [['nome', 'ASC']]
    });
  }

  /**
   * Encontrar categoria por nome
   * @param {string} nome - Nome da categoria
   * @returns {object} Categoria encontrada
   */
  async findByNome(nome) {
    const categoria = await this.model.findOne({
      where: { nome: nome.trim() }
    });

    if (!categoria) {
      throw {
        status: 404,
        message: `Categoria "${nome}" não encontrada`
      };
    }

    return categoria;
  }

  /**
   * Verificar se categoria tem vagas associadas
   * @param {number} id - ID da categoria
   * @returns {boolean} True se tem vagas
   */
  async temVagas(id) {
    // Importa Vaga para verificar relacionamento
    const VagaModel = require(path.resolve(__dirname, '../../models/Vaga'))(sequelize, DataTypes);
    const count = await VagaModel.count({
      where: { id_categoria: id }
    });
    return count > 0;
  }
}

module.exports = CategoriavagaRepository;
