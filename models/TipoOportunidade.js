module.exports = (sequelize, DataTypes) => {
  const TipoOportunidade = sequelize.define('TipoOportunidade', {
    id_tipo_oportunidade: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }}, {
    tableName: 'TipoOportunidade',
    timestamps: false
  });
    return TipoOportunidade;
}