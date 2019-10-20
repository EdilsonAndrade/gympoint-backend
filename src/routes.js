import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import auth from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
export default routes;
