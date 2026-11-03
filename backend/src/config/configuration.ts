import * as Joi from 'joi';

export const configuration = () => ({
  port: Number(process.env.PORT ?? 3000),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  corsOrigin: process.env.CORS_ORIGIN,
});

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().pattern(/^\d+(s|m|h|d)$/).required(),
  BOSS_EMAIL: Joi.string().email().required(),
  BOSS_PASSWORD_HASH: Joi.string().min(20).required(),
  CORS_ORIGIN: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
});
