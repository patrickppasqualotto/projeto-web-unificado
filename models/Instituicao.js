module.exports = (sequelize, DataTypes) => {
    const Instituicao = sequelize.define('Instituicao', {
        id_instituicao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false}}, {
        tableName: 'Instituicao',
        timestamps: false
    });
    return Instituicao;
}