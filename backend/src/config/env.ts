import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envVarsSchema = Joi.object({
  PORT: Joi.number().default(5000),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().required(),
  CLOUDINARY_URL: Joi.string().required(),
  CLIENT_URL: Joi.string().required(),
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  PORT: envVars.PORT,
  MONGODB_URI: envVars.MONGODB_URI,
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_REFRESH_SECRET: envVars.JWT_REFRESH_SECRET,
  STRIPE_SECRET_KEY: envVars.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: envVars.STRIPE_WEBHOOK_SECRET,
  CLOUDINARY_URL: envVars.CLOUDINARY_URL,
  CLIENT_URL: envVars.CLIENT_URL,
};
