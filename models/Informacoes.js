module.exports = (sequelize, DataTypes) => {
    const Informacoes = sequelize.define('Informacoes', {
        id_informacoes: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        chave: {
            type: DataTypes.STRING,
            allowNull: false
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        conteudo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        endereco: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        telefone: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        ultima_att: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Informacoes',
        timestamps: false
    });
    return Informacoes;
}