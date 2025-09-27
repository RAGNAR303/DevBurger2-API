import * as Yup from 'yup'; // Validação de dados
import User from '../models/User';
import jwt from 'jsonwebtoken'; // Gear token de autenticação
import authConfig from '../../config/auth'; // Config hash e tempo validação de token
class SessionController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(8).required(),
    });

    // compara se formato esta certo
    const isValid = await schema.isValid(request.body);
    // se nao tiver ele retorna uma mensagem de erro
    // Colou a mensagem em uma função para diminuir a repetição de codigo
    const emailOrPasswordIncorrect = () => {
      return response
        .status(401)
        .json({ error: 'Make sure your email or password are correct' });
    };

    if (!isValid) {
      emailOrPasswordIncorrect();
    }

    const { email, password } = request.body;
    // verifica se o e-mail ja tem no user
    const user = await User.findOne({
      where: {
        email,
      },
    });
    // se tiver email igual ele barra
    if (!user) {
      emailOrPasswordIncorrect();
    }
    // comparação de senha metodo criado no user o "comparePassword"
    const isSamePassword = await user.checkPassword(password);
    // se a senha estiver errada
    if (!isSamePassword) {
      emailOrPasswordIncorrect();
    }
    // espõe os dados do usário

    return response.status(201).json({
      id: user.id,
      name: user.name,
      email,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        // configuração para gerar token de usuario com
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
