import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { error } from '../utils/apiResponse';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error: validationError } = schema.validate(req.body);
    if (validationError) {
      return error(res, validationError.details[0].message, 400);
    }
    next();
  };
};
