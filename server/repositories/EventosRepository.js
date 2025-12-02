/**
 * EVENTOS REPOSITORY - Acesso a dados de Eventos
 */

const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const BaseRepository = require('./BaseRepository');

const EventoModel = require(path.resolve(__dirname, '../../models/Evento'))(sequelize, DataTypes);
const UsuarioModel = require(path.resolve(__dirname, '../../models/Usuario'))(sequelize, DataTypes);
const CursoModel = require(path.resolve(__dirname, '../../models/Curso'))(sequelize, DataTypes);

// Configurar relacionamentos
EventoModel.belongsTo(UsuarioModel, { foreignKey: 'id_organizador', as: 'organizador' });
EventoModel.belongsTo(CursoModel, { foreignKey: 'id_curso', as: 'curso' });

class EventosRepository extends BaseRepository {
  constructor() {
    super(EventoModel);
  }

  /**
   * Listar eventos com relacionamentos
   * @returns {array} Eventos
   */
  async listarComRelacionamentos() {
    return this.findAll({
      include: [
        { model: UsuarioModel, as: 'organizador', attributes: ['id_usuario', 'nome', 'email'] },
        { model: CursoModel, as: 'curso', attributes: ['id_curso', 'nome'] }
      ],
      order: [['data_inicio', 'DESC']]
    });
  }

  /**
   * Listar eventos futuros
   * @returns {array} Eventos futuros
   */
  async listarFuturos() {
    return this.findAll({
      where: {
        data_inicio: { [sequelize.Op.gt]: new Date() }
      },
      include: [
        { model: UsuarioModel, as: 'organizador', attributes: ['nome'] },
        { model: CursoModel, as: 'curso', attributes: ['nome'] }
      ],
      order: [['data_inicio', 'ASC']]
    });
  }

  /**
   * Encontrar evento com relacionamentos
   * @param {number} id - ID do evento
   * @returns {object} Evento
   */
  async findByIdComRelacionamentos(id) {
    return this.findById(id, {
      include: [
        { model: UsuarioModel, as: 'organizador', attributes: ['id_usuario', 'nome', 'email'] },
        { model: CursoModel, as: 'curso', attributes: ['id_curso', 'nome'] }
      ]
    });
  }

  /**
   * Filtrar eventos por data ou curso
   * @param {object} filtros - { dataInicio, dataFim, idCurso }
   * @returns {array} Eventos
   */
  async filtrar(filtros = {}) {
    const where = {};

    if (filtros.dataInicio) {
      where.data_inicio = { [sequelize.Op.gte]: new Date(filtros.dataInicio) };
    }

    if (filtros.dataFim) {
      where.data_fim = { [sequelize.Op.lte]: new Date(filtros.dataFim) };
    }

    if (filtros.idCurso) {
      where.id_curso = filtros.idCurso;
    }

    return this.findWith(where, {
      include: [
        { model: UsuarioModel, as: 'organizador', attributes: ['nome'] },
        { model: CursoModel, as: 'curso', attributes: ['nome'] }
      ],
      order: [['data_inicio', 'ASC']]
    });
  }
}

module.exports = EventosRepository;
