import authConfig from '../../config/auth';
import jwt from 'jsonwebtoken';

function authMiddleware(request, response, next) {
  const authToken = request.headers.authorization; // pegando o token que vem do headers

  // se não vir o token mostra um aviso e não quebra aplicação
  if (!authToken) {
    return response
      .status(401)
      .json({ error: 'Token not provided(Token não fornecido)' });
  }
  // Separa o "bearer" do token
  const token = authToken.split(' ').at(1);

  console.log(token);

  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new Error();
      }
      request.userId = decoded.id;
      request.userName = decoded.name;
    });
  } catch (err) {
    return response.status(401).json({ error: 'Token is invalid' });
  }
  return next(); // continua o processo => sem ele trava aplicação
}

export default authMiddleware;
