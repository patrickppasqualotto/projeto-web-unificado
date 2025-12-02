module.exports = (sequelize, DataTypes) => {
    const Curso = sequelize.define('Curso', {
        id_curso: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_instituicao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Instituicao',
                key: 'id_instituicao'
            }
        }
    }, {
        tableName: 'Curso',
        timestamps: false
    });
    return Curso;
}