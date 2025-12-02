/**
 * OPORTUNIDADES REPOSITORY - Acesso a dados de Oportunidades
 */

const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const BaseRepository = require('./BaseRepository');

const OportunidadeModel = require(path.resolve(__dirname, '../../models/Oportunidade'))(sequelize, DataTypes);
const TipoOportunidadeModel = require(path.resolve(__dirname, '../../models/TipoOportunidade'))(sequelize, DataTypes);

// Configurar relacionamentos
OportunidadeModel.belongsTo(TipoOportunidadeModel, { foreignKey: 'id_tipo_oportunidade', as: 'tipo' });

class OportunidadesRepository extends BaseRepository {
  constructor() {
    super(OportunidadeModel);
  }

  /**
   * Listar oportunidades com relacionamentos
   * @returns {array} Oportunidades
   */
  async listarComRelacionamentos() {
    return this.findAll({
      include: [
        { model: TipoOportunidadeModel, as: 'tipo', attributes: ['id_tipo_oportunidade', 'nome'] }
      ],
      order: [['data_publicacao', 'DESC']]
    });
  }

  /**
   * Listar oportunidades ativas
   * @returns {array} Oportunidades ativas
   */
  async listarAtivas() {
    return this.findAll({
      where: {
        [sequelize.Op.or]: [
          { data_prazo: null },
          { data_prazo: { [sequelize.Op.gt]: new Date() } }
        ]
      },
      include: [
        { model: TipoOportunidadeModel, as: 'tipo', attributes: ['nome'] }
      ],
      order: [['data_publicacao', 'DESC']]
    });
  }

  /**
   * Encontrar oportunidade com relacionamentos
   * @param {number} id - ID da oportunidade
   * @returns {object} Oportunidade
   */
  async findByIdComRelacionamentos(id) {
    return this.findById(id, {
      include: [
        { model: TipoOportunidadeModel, as: 'tipo', attributes: ['id_tipo_oportunidade', 'nome'] }
      ]
    });
  }

  /**
   * Filtrar oportunidades por tipo
   * @param {number} tipoId - ID do tipo
   * @returns {array} Oportunidades
   */
  async filtrarPorTipo(tipoId) {
    return this.findWith({
      id_tipo_oportunidade: tipoId
    }, {
      include: [
        { model: TipoOportunidadeModel, as: 'tipo', attributes: ['nome'] }
      ],
      order: [['data_publicacao', 'DESC']]
    });
  }
}

module.exports = OportunidadesRepository;
