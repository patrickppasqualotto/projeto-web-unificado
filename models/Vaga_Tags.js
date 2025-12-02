module.exports = (sequelize, DataTypes) => {
    const Vaga_Tags = sequelize.define('Vaga_Tags', {
        id_vaga : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Vaga',
                key: 'id_vaga'
            }
        },
        id_tag : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Tags',
                key: 'id_tag'
            }
        }
    }, {
        tableName: 'Vaga_Tags'
    });
    return Vaga_Tags;
}