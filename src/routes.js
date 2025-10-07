import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import authMiddleware from './app/middlewares/auth';
import CategoryController from './app/controllers/CategoryController';
import OrderController from './app/controllers/OrderController';
import CreatePaymentIntentController from './app/controllers/stripe/CreatePaymentIntentController';

const routes = new Router();
// Criar a rotas para ser acessadas pelo navegador

const upload = multer(multerConfig);

routes.post('/users', UserController.store); // Criação de usuário
routes.post('/session', SessionController.store); // loginde usuario

routes.use(authMiddleware); // rota para autenticação => se não for administrador

routes.post('/products', upload.single('file'), ProductController.store); // rota de criação produtos
routes.get('/products', ProductController.index); // rota de listagem produtos
routes.put('/products/:id', upload.single('file'), ProductController.update); // rota para edição de produtos

routes.post('/categories', upload.single('file'), CategoryController.store); // rota de criação categorias
routes.get('/categories', CategoryController.index); // rota de listagem categorias
routes.put('/categories/:id', upload.single('file'), CategoryController.update); // rota para edição de categorias

routes.post('/orders', OrderController.store); // rota de criação pedidos
routes.get('/orders', OrderController.index); // rota que faz a listagem dos pedidos
routes.put('/orders/:id', OrderController.update); // rota de atualização pedidos

routes.post('/create-payment-intent', CreatePaymentIntentController.store);

export default routes;
