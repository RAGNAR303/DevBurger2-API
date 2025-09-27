import * as Yup from 'yup';
import Order from '../schemas/Order';
import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';

class OrderController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });
    // Verificação das informaçoes, se esta no formato igual do "schema"
    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }
    // pega os produtos que vem do "body", o id e quantity
    const { products } = request.body;

    console.log(products);

    const productsIds = products.map((product) => product.id);

    const findProducts = await Product.findAll({
      where: {
        id: productsIds,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    const formattedProducts = findProducts.map((product) => {
      const productIndex = products.findIndex((item) => item.id === product.id);

      const newProduct = {
        id: product.id, // id do produto
        name: product.name, // nome do produto
        category: product.category.name, // nome da categoria do produto
        price: product.price, // preço do produto
        url: product.url, // URL que e Path a imagem do produto
        quantity: products[productIndex].quantity, // e a quantidade que foi pedida
      };

      return newProduct;
    });

    const order = {
      user: {
        id: request.userId, // id do cliente
        name: request.userName, // nome do cliente
      },
      products: formattedProducts, // a lista do produtos, formatada
      status: 'Pedido realizado',
    };
    const createdOrder = await Order.create(order);

    // Retorna para fora da aplicação as informações de "order"
    return response.status(201).json(createdOrder);
  }
  // cria uma rota de listagem de todos produtos
  async index(request, response) {
    const orders = await Order.find();

    return response.json(orders);
  }

  async update(request, response) {
    const schema = Yup.object({
      status: Yup.string().required(),
    });
    // Verificação das informaçoes, se esta no formato igual do "schema"
    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json({
        message: 'User is not an administrator(Usuario não e administrador)',
      });
    }

    const { id } = request.params;
    const { status } = request.body;
    // pega o pedido pelo "ID" e o que vai fazer um update que e o "status"

    try {
      await Order.updateOne({ _id: id }, { status });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({ message: 'Status updated sucessfully' });
  }
}

export default new OrderController();
