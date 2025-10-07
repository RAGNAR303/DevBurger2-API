import { v4 } from 'uuid';
import User from '../models/User';
import * as Yup from 'yup';

class UserController {
  // metodo para criação de usuario
  async store(request, response) {
    // Faz a validação dos dados com Yup
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(8).required(),
      admin: Yup.boolean(),
    });

    // validação e tras o erros que no cadastro
    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name, email, password, admin } = request.body;

    // verficação se ja existe usuario
    const userExists = await User.findOne({
      where: {
        email,
      },
    });


    // se tiver o mesmo usuario ele da return para nao quebra a aplicação
    if (userExists) {
      return response
        .status(409)
        .json({ error: 'User already exists(Usuarios já existe)' });
    }

    // o que precisa ser mandado para criação de usuario
    const user = await User.create({
      id: v4(), // exceto id => gera automatico com UUID
      name,
      email,
      password,
      admin,
    });

    // quando for criado o usuario ele vai retorna filtrado as infomações
    return response.status(201).json({
      id: user.id,
      name,
      email,
      admin,
    });
  }
}

export default new UserController();
