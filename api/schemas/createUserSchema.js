import Joi from 'joi';

const createUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(30)
    .required(),
  username: Joi.string()
    .alphanum()
    .min(2)
    .max(10)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required(),
});

export default createUserSchema;
