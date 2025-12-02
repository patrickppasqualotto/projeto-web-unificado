// bcrypt não será usado no modo sem criptografia
const { DataTypes } = require('sequelize');
const path = require('path');

// Subir dois níveis de __dirname (server/lib) para chegar à raiz
const { sequelize } = require(path.resolve(__dirname, '..', '..', 'Configuracao', 'database'));

// Importar modelos
const Usuario = require(path.resolve(__dirname, '..', '..', 'models', 'Usuario'))(sequelize, DataTypes);
const Perfis = require(path.resolve(__dirname, '..', '..', 'models', 'Perfis'))(sequelize, DataTypes);

// Definir associação (caso não esteja carregada)
Usuario.belongsTo(Perfis, { foreignKey: 'id_perfil', as: 'Perfil' });

/**
 * Valida credenciais do usuário contra o banco de dados
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object|null>} usuário sem senha ou null se inválido
 */
async function verifyCredentials(email, password) {
  try {
    const usuario = await Usuario.findOne({ 
      where: { email },
      include: [{
        model: Perfis,
        as: 'Perfil',
        attributes: ['nome']
      }]
    });
    
    if (!usuario) return null;

    // Comparação direta (sem criptografia) - MODO DEMO
    if (usuario.senha !== password) return null;

    // Mapear role baseado no nome do perfil
    const perfilNome = usuario.Perfil?.nome || 'Usuario';
    const role = perfilNome === 'Administrador' ? 'admin' : 'user';

    // Retornar usuário sem a senha
    return {
      id: usuario.id_usuario,
      name: usuario.nome,
      email: usuario.email,
      id_perfil: usuario.id_perfil,
      id_curso: usuario.id_curso,
      role: role,
      profileName: perfilNome
    };
  } catch (err) {
    console.error('Erro ao verificar credenciais:', err);
    return null;
  }
}

/**
 * Busca usuário apenas por email (sem validar senha)
 * @param {string} email
 * @returns {Promise<Object|null>} usuário sem senha ou null se não encontrado
 */
async function findUserByEmail(email) {
  try {
    const usuario = await Usuario.findOne({ 
      where: { email },
      include: [{
        model: Perfis,
        as: 'Perfil',
        attributes: ['nome']
      }]
    });
    
    if (!usuario) return null;

    // Mapear role baseado no nome do perfil
    const perfilNome = usuario.Perfil?.nome || 'Usuario';
    const role = perfilNome === 'Administrador' ? 'admin' : 'user';

    return {
      id: usuario.id_usuario,
      name: usuario.nome,
      email: usuario.email,
      id_perfil: usuario.id_perfil,
      id_curso: usuario.id_curso,
      role: role,
      profileName: perfilNome
    };
  } catch (err) {
    console.error('Erro ao buscar usuário por email:', err);
    return null;
  }
}

module.exports = { verifyCredentials, findUserByEmail };
