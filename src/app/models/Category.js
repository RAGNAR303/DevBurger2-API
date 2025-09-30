import Sequelize, { Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING, // => campo de nome da categoria
        description: Sequelize.STRING,
        path: Sequelize.STRING, // => campo de arquivo
        url: {
          // => campo virtual para espor a url do arquivo para front-end
          type: Sequelize.VIRTUAL,

          get() {
            // cria um campo virtual
            return `http://localhost:3002/category-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
      },
    );
    return this;
  }
}

export default Category;

//TODO model criada para migration de category-table
