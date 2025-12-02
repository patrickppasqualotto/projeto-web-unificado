/**
 * NOTICIAS REPOSITORY - Acesso a dados de Notícias
 */

const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const BaseRepository = require('./BaseRepository');

const NoticiaModel = require(path.resolve(__dirname, '../../models/Noticia'))(sequelize, DataTypes);
const UsuarioModel = require(path.resolve(__dirname, '../../models/Usuario'))(sequelize, DataTypes);

// Configurar relacionamentos
NoticiaModel.belongsTo(UsuarioModel, { foreignKey: 'id_autor', as: 'autor' });

class NoticiasRepository extends BaseRepository {
  constructor() {
    super(NoticiaModel);
  }

  /**
   * Listar notícias com relacionamentos
   * @returns {array} Notícias
   */
  async listarComRelacionamentos() {
    return this.findAll({
      include: [
        { model: UsuarioModel, as: 'autor', attributes: ['id_usuario', 'nome', 'email'] }
      ],
      order: [['data_publicacao', 'DESC']]
    });
  }

  /**
   * Listar notícias ativas (não expiradas)
   * @returns {array} Notícias ativas
   */
  async listarAtivas() {
    return this.findAll({
      where: {
        [sequelize.Op.or]: [
          { data_expiracao: null },
          { data_expiracao: { [sequelize.Op.gt]: new Date() } }
        ]
      },
      include: [
        { model: UsuarioModel, as: 'autor', attributes: ['nome'] }
      ],
      order: [['data_publicacao', 'DESC']]
    });
  }

  /**
   * Encontrar notícia com relacionamentos
   * @param {number} id - ID da notícia
   * @returns {object} Notícia
   */
  async findByIdComRelacionamentos(id) {
    return this.findById(id, {
      include: [
        { model: UsuarioModel, as: 'autor', attributes: ['id_usuario', 'nome', 'email'] }
      ]
    });
  }

  /**
   * Buscar notícias por texto
   * @param {string} texto - Texto para buscar
   * @returns {array} Notícias
   */
  async buscarPorTexto(texto) {
    return this.findWith({
      [sequelize.Op.or]: [
        { titulo: { [sequelize.Op.iLike]: `%${texto}%` } },
        { conteudo: { [sequelize.Op.iLike]: `%${texto}%` } }
      ]
    }, {
      include: [
        { model: UsuarioModel, as: 'autor', attributes: ['nome'] }
      ],
      order: [['data_publicacao', 'DESC']]
    });
  }
}

module.exports = NoticiasRepository;
