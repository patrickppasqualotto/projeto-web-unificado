const { sequelize } = require('../Configuracao/database');
const { DataTypes } = require('sequelize');

const Usuario = require('./Usuario')(sequelize, DataTypes);
const Perfis = require('./Perfis')(sequelize, DataTypes);
const Curso = require('./Curso')(sequelize, DataTypes);
const Instituicao = require('./Instituicao.js')(sequelize, DataTypes);
const Noticia = require('./Noticia')(sequelize, DataTypes);
const Evento = require('./Evento')(sequelize, DataTypes);
const Oportunidade = require('./Oportunidade')(sequelize, DataTypes);
const TipoOportunidade = require('./TipoOportunidade')(sequelize, DataTypes);
const Informacoes = require('./Informacoes')(sequelize, DataTypes);
const Vaga = require('./Vaga')(sequelize, DataTypes);
const Vaga_Tags = require('./Vaga_Tags')(sequelize, DataTypes);
const Tags = require('./Tags')(sequelize, DataTypes);
const Categoria_vaga = require('./Categoria_vaga')(sequelize, DataTypes);

// Definindo o relacionamento de vaga com instituição
Instituicao.hasMany(Curso, { foreignKey: 'id_instituicao' });
Curso.belongsTo(Instituicao, { foreignKey: 'id_instituicao' });

Curso.hasMany(Usuario, { foreignKey: 'id_curso' });
Usuario.belongsTo(Curso, { foreignKey: 'id_curso' });

Curso.hasMany(Evento, { foreignKey: 'id_curso' });
Evento.belongsTo(Curso, { foreignKey: 'id_curso' });

Perfis.hasMany(Usuario, { foreignKey: 'id_perfil' });
Usuario.belongsTo(Perfis, { foreignKey: 'id_perfil' });

Usuario.hasMany(Noticia, { foreignKey: 'id_autor' });
Noticia.belongsTo(Usuario, { foreignKey: 'id_autor' });

Usuario.hasMany(Evento, { foreignKey: 'id_organizador' });
Evento.belongsTo(Usuario, { foreignKey: 'id_organizador' });

Usuario.hasMany(Vaga, { foreignKey: 'id_usuario_publicador' });
Vaga.belongsTo(Usuario, { foreignKey: 'id_usuario_publicador' });

Categoria_vaga.hasMany(Vaga, { foreignKey: 'id_categoria' });
Vaga.belongsTo(Categoria_vaga, { foreignKey: 'id_categoria' });

TipoOportunidade.hasMany(Oportunidade, { foreignKey: 'id_tipo_oportunidade' });
Oportunidade.belongsTo(TipoOportunidade, { foreignKey: 'id_tipo_oportunidade' });

// Relação N:N entre Vaga e Tags (através de Vaga_Tags)
Vaga.belongsToMany(Tags, {
  through: Vaga_Tags,
  foreignKey: 'id_vaga',
  otherKey: 'id_tag',
  as: 'tags'
});
Tags.belongsToMany(Vaga, {
  through: Vaga_Tags,
  foreignKey: 'id_tag',
  otherKey: 'id_vaga',
  as: 'vagas'
});

module.exports = {
    sequelize,
    Usuario,
    Perfis,
    Curso,
    Instituicao,
    Noticia,
    Evento,
    Oportunidade,
    TipoOportunidade,
    Informacoes,
    Vaga,
    Vaga_Tags,
    Tags,
    Categoria_vaga
};