module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Perfis',
            key: 'id_perfil'
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
    tableName: 'Usuario',
    timestamps: false
  });
    return Usuario;
};