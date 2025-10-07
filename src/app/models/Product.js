import Sequelize, { Model } from 'sequelize';

const baseUrl = process.env.BASE_URL;

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        description: Sequelize.STRING,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        url: {
          type: Sequelize.VIRTUAL,

          get() {
            // cria um campo virtual
            return `${baseUrl}/product-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
      },
    );
    return this;
  }
  static associate(models) {
    // associação com models DE "Category", que esta dentro da pasta "models"
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  }
}

export default Product;
