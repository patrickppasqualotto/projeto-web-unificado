/**
 * ERROR HANDLER - Gestão Centralizada de Erros
 * 
 * Padroniza tratamento e logging de erros
 * Fornece recuperação elegante e mensagens consistentes
 */

const fs = require('fs');
const path = require('path');

// Criar diretório de logs se não existir
const logsDir = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

/**
 * Log de erro em arquivo
 * @param {string} level - Nível (ERROR, WARN, INFO)
 * @param {string} message - Mensagem
 * @param {object} error - Objeto de erro
 * @param {object} context - Contexto adicional
 */
function logToFile(level, message, error, context = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    error: {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    },
    context
  };

  const logFile = path.resolve(logsDir, `${level.toLowerCase()}.log`);
  const logLine = JSON.stringify(logEntry) + '\n';

  fs.appendFileSync(logFile, logLine, 'utf8');
}

/**
 * Log no console (desenvolvimento)
 * @param {string} level - Nível (ERROR, WARN, INFO)
 * @param {string} message - Mensagem
 * @param {object} error - Objeto de erro
 */
function logToConsole(level, message, error) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;

  switch (level) {
    case 'ERROR':
      console.error(`${prefix} ${message}`, error);
      break;
    case 'WARN':
      console.warn(`${prefix} ${message}`, error);
      break;
    case 'INFO':
      console.info(`${prefix} ${message}`);
      break;
    default:
      console.log(`${prefix} ${message}`, error);
  }
}

/**
 * Log genérico
 * @param {string} level - Nível de log
 * @param {string} message - Mensagem
 * @param {object} error - Erro (opcional)
 * @param {object} context - Contexto (opcional)
 */
function log(level, message, error = null, context = {}) {
  logToConsole(level, message, error);
  logToFile(level, message, error, context);
}

/**
 * Classe customizada de erro da aplicação
 */
class AppError extends Error {
  constructor(message, status = 500, field = null, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.field = field;
    this.originalError = originalError;
  }

  toJSON() {
    return {
      error: {
        status: this.status,
        message: this.message,
        field: this.field,
        type: this.name
      }
    };
  }
}

/**
 * Valida e normaliza erro
 * @param {Error|object} error - Erro a normalizar
 * @returns {AppError} Erro normalizado
 */
function normalizeError(error) {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500, null, error);
  }

  if (typeof error === 'object') {
    return new AppError(
      error.message || 'Erro desconhecido',
      error.status || 500,
      error.field || null,
      error
    );
  }

  return new AppError('Erro desconhecido', 500);
}

/**
 * Middleware de tratamento global de erros
 * Deve ser o último middleware
 */
function errorMiddleware(err, req, res, next) {
  const error = normalizeError(err);

  // Log do erro
  log('ERROR', `${req.method} ${req.path}`, error.originalError, {
    status: error.status,
    field: error.field,
    userId: req.session?.user?.id_usuario
  });

  // Em desenvolvimento, retorna mais detalhes
  const isDev = process.env.NODE_ENV === 'development';

  if (req.accepts('json')) {
    // API: Retorna JSON
    return res.status(error.status).json({
      error: {
        status: error.status,
        message: error.message,
        field: error.field,
        ...(isDev && { stack: error.originalError?.stack })
      }
    });
  }

  // MVC: Renderiza página de erro
  res.status(error.status).render('error', {
    message: error.message,
    status: error.status,
    ...(isDev && { stack: error.originalError?.stack })
  });
}

/**
 * Wrapper para rotas assíncronas (evita try-catch repetitivo)
 * @param {function} fn - Função assíncrona
 * @returns {function} Função com tratamento de erro
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  AppError,
  normalizeError,
  errorMiddleware,
  asyncHandler,
  log,
  logToFile,
  logToConsole
};
