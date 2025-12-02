module.exports = (sequelize, DataTypes) => {
    const Noticia = sequelize.define('Noticia', {
        id_noticia: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        conteudo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        data_publicacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        id_autor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Usuario',
                key: 'id_usuario'
            }
        },
        data_expiracao: {
            type: DataTypes.DATE,
            allowNull: true
        },
        imagem_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        subtitulo: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'Noticia',
        timestamps: false
    });
    return Noticia;
}