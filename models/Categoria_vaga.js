module.exports = (sequelize, DataTypes) => {
    const Categoria_vaga = sequelize.define('Categoria_vaga', {
        id_categoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'Categoria_vaga'
    });
    return Categoria_vaga;
}
