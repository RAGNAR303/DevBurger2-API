import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class ProductController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      description: Yup.string().max(255),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }
    // Validação se usuario e administrador => se ele nao for não pode criar produtos
    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json({
        message: 'User is not an administrator(Usuario não e administrador)',
      });
    }

    const { filename: path } = request.file;
    const { name, price, category_id, offer, description } = request.body;

    const product = await Product.create({
      name,
      price,
      description,
      category_id,
      path,
      offer,
    });

    return response.status(201).json(product);
  }
  // Fazer opção de editar arquivos
  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      description: Yup.string().max(255),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }
    // Validação se usuario e administrador => se ele nao for não pode criar produtos
    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json({
        message: 'User is not an administrator(Usuario não e administrador)',
      });
    }
    const { id } = request.params;

    const findProduct = await Product.findByPk(id);

    if (!findProduct) {
      return response
        .status(400)
        .json({ error: 'Make sure your product ID is correct' });
    }
    // Deixa a variavel path(que a opção de colocar arquivo) opcional

    // deixa opcional o campo de arquivo de imagem
    let path;
    if (request.file) {
      path = request.file.filename;
    }

    const { name, price, category_id, offer, description } = request.body;
    // Fazendo edição do produtos
    await Product.update(
      {
        name,
        price,
        description,
        category_id,
        path,
        offer,
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
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    return response.json(products);
  }
}

export default new ProductController();
