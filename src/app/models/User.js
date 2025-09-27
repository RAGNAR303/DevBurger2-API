import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';
// interface para percitir dados no nosso banco
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      },
    );
    // cripitografia da senha do usuario no banco
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        // "10" seria a força da senha
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    });

    return this;
  }
  // comparação de senhas, metodo criado para verficar se a senha cadastrada e igual asenha que vai ser inserida no login
  async checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
