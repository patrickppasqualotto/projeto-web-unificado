module.exports = (sequelize, DataTypes) => {
    const Oportunidade = sequelize.define('Oportunidade', {
        id_oportunidade: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        data_publicacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        data_prazo: {
            type: DataTypes.DATE,
            allowNull: true
        },
        id_tipo_oportunidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'TipoOportunidade',
                key: 'id_tipo_oportunidade'
            }
        },
        link: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'Oportunidade',
        timestamps: false
    });
    return Oportunidade;
}