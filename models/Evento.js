module.exports = (sequelize, DataTypes) => {
    const Evento = sequelize.define('Evento', {
        id_evento: {
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
        data_inicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        data_fim: {
            type: DataTypes.DATE,
            allowNull: true
        },
        local_evento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        link_inscricao: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_organizador: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Usuario',
                key: 'id_usuario'
            }
        },
        id_curso: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Curso',
                key: 'id_curso'
            }
        }
    }, {
        tableName: 'Evento',
        timestamps: false
    });
    return Evento;
}