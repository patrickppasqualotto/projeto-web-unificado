module.exports = (sequelize, DataTypes) => {
    const Vaga = sequelize.define('Vaga', {
        id_vaga: {
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
        requisitos: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        data_publicacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        data_expiracao: {
            type: DataTypes.DATE,
            allowNull: false
        },
        id_categoria: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categoria_vaga',
                key: 'id_categoria'
            }
        },
        id_usuario_publicador: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Usuario',
                key: 'id_usuario'
            }
        },
        fonte: {
            type: DataTypes.STRING,
            allowNull: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dados_brutos: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        nome_empresa: {
            type: DataTypes.STRING,
            allowNull: true
        },
        localizacao: {
            type: DataTypes.STRING,
            allowNull: true
        },
        salario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true // Se não for obrigatório
        }
    }, {
        tableName: 'Vaga',
        timestamps: false,
        underscored: true
    });
    return Vaga;
}