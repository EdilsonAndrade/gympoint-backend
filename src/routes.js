import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import auth from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:planId', PlanController.update);
routes.delete('/plans/:planId', PlanController.delete);
routes.post(
  '/plans/:planId/students/:studentId/registrations',
  RegistrationController.store
);
routes.get('/registrations', RegistrationController.index);
routes.delete('/registrations/:registrationId', RegistrationController.delete);
routes.put('/registrations/:registrationId', RegistrationController.update);

export default routes;
