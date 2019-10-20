import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import auth from '../../config/auth';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  const [, token] = authorization.split(' ');
  try {
    if (!(await promisify(jwt.verify)(token, auth.secret))) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    return next();
  } catch (error) {
    return res.status(401).json({ error: `Not authorized ${error}` });
  }
};
