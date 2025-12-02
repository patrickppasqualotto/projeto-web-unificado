/**
 * MESSAGE HANDLER - Gestão Centralizada de Mensagens
 * 
 * Padroniza mensagens de sucesso, erro e validação
 * Usa session para exibição na view seguinte
 */

const MessageType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Cria uma mensagem formatada
 * @param {string} type - Tipo da mensagem (success, error, warning, info)
 * @param {string} text - Texto da mensagem
 * @param {object} data - Dados adicionais (opcional)
 * @returns {object} Mensagem formatada
 */
function createMessage(type, text, data = null) {
  const message = {
    type,
    text,
    timestamp: new Date().toISOString()
  };

  if (data) {
    message.data = data;
  }

  return message;
}

/**
 * Define mensagem de sucesso na sessão
 * @param {object} req - Objeto da requisição Express
 * @param {string} text - Texto da mensagem
 * @param {object} data - Dados adicionais (opcional)
 */
function setSuccessMessage(req, text, data = null) {
  if (req.session) {
    req.session.message = createMessage(MessageType.SUCCESS, text, data);
  }
}

/**
 * Define mensagem de erro na sessão
 * @param {object} req - Objeto da requisição Express
 * @param {string} text - Texto da mensagem
 * @param {object} data - Dados adicionais (opcional)
 */
function setErrorMessage(req, text, data = null) {
  if (req.session) {
    req.session.message = createMessage(MessageType.ERROR, text, data);
  }
}

/**
 * Define mensagem de aviso na sessão
 * @param {object} req - Objeto da requisição Express
 * @param {string} text - Texto da mensagem
 * @param {object} data - Dados adicionais (opcional)
 */
function setWarningMessage(req, text, data = null) {
  if (req.session) {
    req.session.message = createMessage(MessageType.WARNING, text, data);
  }
}

/**
 * Define mensagem de informação na sessão
 * @param {object} req - Objeto da requisição Express
 * @param {string} text - Texto da mensagem
 * @param {object} data - Dados adicionais (opcional)
 */
function setInfoMessage(req, text, data = null) {
  if (req.session) {
    req.session.message = createMessage(MessageType.INFO, text, data);
  }
}

/**
 * Retorna a mensagem e limpa da sessão
 * @param {object} req - Objeto da requisição Express
 * @returns {object|null} Mensagem ou null
 */
function getMessage(req) {
  if (req.session && req.session.message) {
    const message = req.session.message;
    delete req.session.message;
    return message;
  }
  return null;
}

/**
 * Middleware para disponibilizar mensagens nas views
 */
function messageMiddleware(req, res, next) {
  res.locals.message = getMessage(req);
  next();
}

module.exports = {
  MessageType,
  createMessage,
  setSuccessMessage,
  setErrorMessage,
  setWarningMessage,
  setInfoMessage,
  getMessage,
  messageMiddleware
};
