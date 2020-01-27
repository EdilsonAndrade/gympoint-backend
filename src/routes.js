import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import HelpOrderNotAnsweredController from './app/controllers/HelpOrderNotAnsweredController';
import auth from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/students/:studentId/checkins', CheckinController.store);

routes.get('/students/:studentId/checkins', CheckinController.index);
routes.get('/students/:studentId/help-orders', HelpOrderController.index);
routes.post('/students/:studentId/help-orders', HelpOrderController.store);
routes.get('/help-orders', HelpOrderNotAnsweredController.index);
routes.post(
  '/help-orders/:helpOrderId/answer',
  HelpOrderNotAnsweredController.store
);
routes.get('/students/:studentId', StudentController.index);
routes.use(auth);

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.put('/students', StudentController.update);
routes.delete('/students/:id', StudentController.delete);
routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
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
