module.exports = (sequelize, DataTypes) => {
  const Perfis = sequelize.define('Perfis', {
    id_perfil: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }}, {
    tableName: 'Perfis',
    timestamps: false
  });
    return Perfis;
};