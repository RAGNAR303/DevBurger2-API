import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object({
      // válida se e uma "string" e  é obrigatória
      name: Yup.string().required(),
      description: Yup.string().max(255),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    // Validação se usuario e administrador => se ele nao for não pode criar categorias

    const { admin: isAdmin } = await User.findByPk(request.userId);

    console.log({ isAdmin });

    if (!isAdmin) {
      return response.status(401).json({
        message: 'User is not an administrator(Usuario não e administrador)',
      });
    }

    const { filename: path } = request.file;
    const { name, description } = request.body;

    // procurando categoria no banco para comparar

    const categoryExists = await Category.findOne({
      where: {
        name,
      },
    });
    // Se existir mostra um aviso
    if (categoryExists) {
      return response.status(400).json({ error: 'Category already exists' });
    }
    console.log({ name, description, path });

    const { id } = await Category.create({
      name,
      description,
      path,
    });

    return response.status(201).json({ id, name, description });
  }

  async update(request, response) {
    const schema = Yup.object({
      // válida se e uma "string" , e sem "requerid()" ele vira opcional
      name: Yup.string(),
      description: Yup.string().max(255),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    // Validação se usuario e administrador => se ele nao for não pode criar categorias

    const { admin: isAdmin } = await User.findByPk(request.userId);
    // faz um if para comparar e depois retorna uma menssagem
    if (!isAdmin) {
      return response.status(401).json({
        message: 'User is not an administrator(Usuario não e administrador)',
      });
    }
    // "id "que e mandado na rota "put" para edição de uma categoria
    const { id } = request.params;

    const categoryExists = await Category.findByPk(id);

    if (!categoryExists) {
      return response.status(400).json({
        message:
          'Make sure your category ID is correct(Certifique-se de que o ID da sua categoria esteja correto)',
      });
    }

    // deixa opcional o campo de arquivo de imagem
    let path;
    if (request.file) {
      path = request.file.filename;
    }

    // pega o nome ca categoria
    const { name, description } = request.body;

    if (name) {
      const categoryNameExists = await Category.findOne({
        where: {
          name,
        },
      });
      // Se existir mostra um aviso
      if (categoryNameExists && categoryNameExists.id != +id) {
        return response.status(400).json({ error: 'Category already exists' });
      }
    }
    // procurando categoria no banco para comparar

    await Category.update(
      {
        name,
        description,
        path,
      },
      {
        where: {
          id,
        },
      },
    );

    return response.status(200).json();
  }

  async index(request, response) {
    const categories = await Category.findAll();

    return response.json(categories);
  }
}

export default new CategoryController();
