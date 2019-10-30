import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

import auth from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.post('/plans', PlanController.store);
export default routes;
